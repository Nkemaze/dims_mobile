import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task.types';
import { taskService } from '@/services/taskService';
import { internshipService } from '@/services/internshipService';
import { quizService } from '@/services/quizService';
import { ApprovedPosition } from '@/types/internship.types';
import { cache } from '@/utils/storage';

const CACHE_TASKS = 'tasks';
const CACHE_POSITIONS = 'approved_positions';
const CACHE_COMPLETED_IDS = 'completed_task_ids';

interface CachedTaskData {
  tasks: Task[];
  approvedPositions: ApprovedPosition[];
  completedTaskIds: string[];
}

interface TaskStore {
  tasks: Task[];
  approvedPositions: ApprovedPosition[];
  hasNoApprovedPositions: boolean;
  selectedTask: Task | null;
  completedTaskIds: string[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: (positionId?: string) => Promise<void>;
  fetchTasksWithPositions: (userId: string) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  markTaskCompletedLocally: (taskId: string) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  approvedPositions: [],
  hasNoApprovedPositions: false,
  selectedTask: null,
  completedTaskIds: [],
  isLoading: false,
  error: null,

  fetchTasks: async (positionId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getByPositionId(positionId);
      set({ tasks, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load tasks' });
    }
  },

  fetchTasksWithPositions: async (userId: string) => {
    // ── 1. Load from cache immediately for offline-first experience ──────────
    const cachedTasks       = await cache.get<Task[]>(CACHE_TASKS) ?? [];
    const cachedPositions   = await cache.get<ApprovedPosition[]>(CACHE_POSITIONS) ?? [];
    const cachedCompleted   = await cache.get<string[]>(CACHE_COMPLETED_IDS) ?? [];

    if (cachedTasks.length > 0) {
      set({
        tasks: cachedTasks,
        approvedPositions: cachedPositions,
        completedTaskIds: cachedCompleted,
        hasNoApprovedPositions: false,
      });
    }

    // ── 2. Fetch fresh from network ──────────────────────────────────────────
    const hasCachedData = cachedTasks.length > 0;
    set({ isLoading: !hasCachedData, error: null, hasNoApprovedPositions: false });

    try {
      const positions = await internshipService.getApprovedInternshipPositions(userId);

      if (positions.length === 0) {
        set({
          approvedPositions: [],
          hasNoApprovedPositions: true,
          tasks: [],
          isLoading: false,
        });
        // Clear stale task caches if user no longer has a position
        await Promise.all([
          cache.clear(CACHE_TASKS),
          cache.clear(CACHE_POSITIONS),
          cache.clear(CACHE_COMPLETED_IDS),
        ]);
        return;
      }

      set({ approvedPositions: positions });

      const allTasksPromises = positions.map(async (p) => {
        const pTasks = await taskService.getByPositionId(p.id);
        return pTasks.map((t) => ({ ...t, internshipposition_id: p.id }));
      });
      const results = await Promise.all(allTasksPromises);
      const mergedTasks = results.flat();
      const uniqueTasks = Array.from(new Map(mergedTasks.map((t) => [t.id, t])).values());

      // Cross-reference quiz answers for completion
      const [allQuizzes, userAnswers] = await Promise.all([
        quizService.getAllQuizzes(),
        quizService.getQuizAnswersByUser(userId),
      ]);

      const answeredQuizIds = new Set(userAnswers.map((a) => a.quiz_id));
      const completedTaskIds = allQuizzes
        .filter((q) => answeredQuizIds.has(q.id))
        .map((q) => q.task_id);

      set({ tasks: uniqueTasks, completedTaskIds, isLoading: false });

      // ── 3. Persist for offline use ─────────────────────────────────────────
      await Promise.all([
        cache.set(CACHE_TASKS, uniqueTasks),
        cache.set(CACHE_POSITIONS, positions),
        cache.set(CACHE_COMPLETED_IDS, completedTaskIds),
      ]);
    } catch (err: any) {
      // Network failed — keep showing cached data, clear the loading indicator
      set({ isLoading: false, error: err?.message || 'Failed to load positions and tasks' });
    }
  },

  fetchTaskById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const task = await taskService.getById(id);
      set({ selectedTask: task, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load task' });
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const updated = await taskService.updateStatus(id, { status });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        selectedTask: updated,
      }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update task' });
    }
  },

  markTaskCompletedLocally: (taskId: string) => {
    set((state) => {
      if (!state.completedTaskIds.includes(taskId)) {
        return { completedTaskIds: [...state.completedTaskIds, taskId] };
      }
      return state;
    });
  },

  clearError: () => set({ error: null }),
}));

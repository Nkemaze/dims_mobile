import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task.types';
import { taskService } from '@/services/taskService';
import { internshipService } from '@/services/internshipService';
import { ApprovedPosition } from '@/types/internship.types';

interface TaskStore {
  tasks: Task[];
  approvedPositions: ApprovedPosition[];
  hasNoApprovedPositions: boolean;
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: (positionId?: string) => Promise<void>;
  fetchTasksWithPositions: (userId: string) => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  approvedPositions: [],
  hasNoApprovedPositions: false,
  selectedTask: null,
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
    set({ isLoading: true, error: null, hasNoApprovedPositions: false });
    try {
      const positions = await internshipService.getApprovedInternshipPositions(userId);
      
      if (positions.length === 0) {
        set({ 
          approvedPositions: [], 
          hasNoApprovedPositions: true, 
          tasks: [], 
          isLoading: false 
        });
        return;
      }

      set({ approvedPositions: positions });
      
      // We can fetch tasks for all positions or default to the first one, or no filter. 
      // Depending on the API, if we don't pass one, does it bring all? We can just fetch them individually or use the first position.
      // Easiest is to fetch tasks based on multiple, but since the endpoint takes a single positionId, we can either call it for all, or not yet for all.
      // If we need to merge from API:
      const allTasksPromises = positions.map(async p => {
        const pTasks = await taskService.getByPositionId(p.id);
        // Hydrate just in case backend omits it
        return pTasks.map(t => ({ ...t, internshipposition_id: p.id }));
      });
      const results = await Promise.all(allTasksPromises);
      // Flatten the results and de-duplicate by ID in case any tasks overlap
      const mergedTasks = results.flat();
      const uniqueTasks = Array.from(new Map(mergedTasks.map(t => [t.id, t])).values());

      set({ tasks: uniqueTasks, isLoading: false });
    } catch (err: any) {
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

  clearError: () => set({ error: null }),
}));

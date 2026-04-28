import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task.types';
import { taskService } from '@/services/taskService';

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAll();
      set({ tasks, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err?.message || 'Failed to load tasks' });
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

import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';

export const useTasks = () => {
  const { user } = useAuthStore();
  const tasks = useTaskStore((s) => s.tasks);
  const isLoading = useTaskStore((s) => s.isLoading);
  const error = useTaskStore((s) => s.error);
  const hasNoApprovedPositions = useTaskStore((s) => s.hasNoApprovedPositions);
  const approvedPositions = useTaskStore((s) => s.approvedPositions);
  
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchTasksWithPositions = useTaskStore((s) => s.fetchTasksWithPositions);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

  useEffect(() => {
    if (user?.id) {
      fetchTasksWithPositions(user.id);
    } else {
      fetchTasks();
    }
  }, [user?.id]);

  return { tasks, isLoading, error, hasNoApprovedPositions, approvedPositions, fetchTasks, fetchTasksWithPositions, updateTaskStatus };
};

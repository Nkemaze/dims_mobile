import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';

export const useTasks = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const isLoading = useTaskStore((s) => s.isLoading);
  const error = useTaskStore((s) => s.error);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, isLoading, error, fetchTasks, updateTaskStatus };
};

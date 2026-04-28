export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  assignedAt: string;
  internId: string;
  supervisorId: string;
}

export interface UpdateTaskPayload {
  status: TaskStatus;
}

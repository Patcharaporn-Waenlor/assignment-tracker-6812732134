export type TaskStatus = 'not_started' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  due_date: string;
  status: TaskStatus;
  created_at?: string;
}

export type TaskInput = Omit<Task, 'id' | 'created_at'>;

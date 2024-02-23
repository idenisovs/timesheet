export interface Task {
  id: number;
  key: string
  name: string;
  activities: number;
  duration: string;
  createdAt: Date;
}

export interface CreateTask extends Omit<Task, 'id'> {}

export interface Task {
  id: number;
  name: string;
  activities: number;
  duration: string;
  createdAt: Date;
}

export interface CreateTask extends Omit<Task, 'id'> {}

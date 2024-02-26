import { Activity } from './Activity';

export interface Issue {
  id: number;
  key: string
  name: string;
  activities: Activity[];
  duration: string;
  createdAt: Date;
}

export interface CreateIssue extends Omit<Issue, 'id'> {
  id?: number;
}

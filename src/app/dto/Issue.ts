import { IssueActivity } from './Activity';

export interface Issue {
  id: number;
  key: string
  name: string;
  activities: IssueActivity[];
  duration: string;
  estimate?: string;
  createdAt: Date;
}

export interface CreateIssue extends Omit<Issue, 'id'> {
  id?: number;
}

export interface Issue {
  id: number;
  key: string
  name: string;
  activities: number;
  duration: string;
  createdAt: Date;
}

export interface CreateIssue extends Omit<Issue, 'id'> {}

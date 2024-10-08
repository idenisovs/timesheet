export interface IssueRecord {
  id: string;
  name: string;
  key: string;
  activities: number;
  duration: string;
  estimate?: string;
  createdAt: Date;
}

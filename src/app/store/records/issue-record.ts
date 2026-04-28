export interface IssueRecord {
  id: string;
  name: string;
  key: string;
  activities: number;
  duration: string;
  estimate?: string;
  color?: string;
  createdAt: Date;
}

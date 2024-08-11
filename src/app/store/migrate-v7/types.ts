export interface IssueRecord {
  id: string;
  name: string;
  key: string;
  activities: string[];
  duration: string;
  estimate?: string;
  createdAt: Date;
}

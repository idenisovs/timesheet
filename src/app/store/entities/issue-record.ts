export interface IssueRecord {
  id: string;
  name: string;
  key: string;
  duration: string;
  estimate?: string;
  createdAt: Date;
}

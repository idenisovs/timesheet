export interface Issue {
  id: string;
  key: string
  name: string;
  activities: string[];
  duration: string;
  estimate?: string;
  createdAt: Date;
}

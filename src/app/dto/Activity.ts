export interface Activity {
  id: string;
  name: string;
  date: Date;
  from: string;
  till: string;
  duration: string;
  weekId: string;
  isImported?: boolean;
}

export interface IssueActivity extends Activity {
  createdAt: Date;
}

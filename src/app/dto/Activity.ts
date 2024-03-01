export interface Activity {
  name: string;
  from: string;
  till: string;
  duration: string;
  isImported?: boolean;
}

export interface IssueActivity extends Activity {
  createdAt: Date;
}

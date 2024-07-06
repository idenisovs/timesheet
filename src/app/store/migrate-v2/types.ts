import { Activity } from '../../dto';

export interface IssueActivity extends Activity {
  createdAt: Date;
}

export interface Issue {
  id: string;
  key: string
  name: string;
  activities: IssueActivity[];
  duration: string;
  estimate?: string;
  createdAt: Date;
}

export interface CreateIssue extends Omit<Issue, 'id'> {
  id?: string;
}

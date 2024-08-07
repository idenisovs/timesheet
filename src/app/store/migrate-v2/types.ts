export class Activity {
  id: string;
  name: string;
  date: Date;
  from: string;
  till: string;
  duration: string;
  weekId: string;
  dayId: string;
  isImported?: boolean;

  constructor() {
    this.id = crypto.randomUUID();
    this.name = '';
    this.date = new Date();
    this.from = '';
    this.till = '';
    this.duration = '';
    this.weekId = '';
    this.dayId = '';
    this.isImported = false;
  }
}

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

export interface Sheet {
  id?: number;
  date: Date|string;
  activities: Activity[];
  isMissing?: boolean;
}

export interface DailySummaryActivity {
  name: string;
  duration: string;
}

export interface DailySummaryIssue {
  key: string;
  name: string;
  activities: DailySummaryActivity[];
  duration: string;
}

export class DailySummary {
  issues: DailySummaryIssue[];
  duration: string;

  constructor() {
    this.issues = [];
    this.duration = '0m';
  }
}

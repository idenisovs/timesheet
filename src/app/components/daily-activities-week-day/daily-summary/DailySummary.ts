export interface DailySummaryActivity {
  name: string;
  duration: string;
  durationRatio: number;
}

export interface DailySummaryIssue {
  key: string;
  name: string;
  activities: DailySummaryActivity[];
  duration: string;
  durationRatio: number;
}

export class DailySummary {
  issues: DailySummaryIssue[];
  duration: string;

  constructor() {
    this.issues = [];
    this.duration = '0m';
  }
}

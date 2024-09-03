import { Activity } from '../../../dto';

export interface DailySummaryActivity {
  name: string;
  count: number;
  duration: string;
  durationRatio: number;
}

export interface DailySummaryIssue {
  key: string;
  name: string;
  activities: Activity[];
  activitySummaries: DailySummaryActivity[];
  duration: string;
  durationRatio: number;
}

export class DailySummary {
  issues: DailySummaryIssue[];
  duration: string;
  activities: Activity[];
  durationRatio: number;

  constructor() {
    this.issues = [];
    this.activities = [];
    this.duration = '0m';
    this.durationRatio = 0;
  }
}

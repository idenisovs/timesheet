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

  constructor() {
    this.issues = [];
    this.duration = '0m';
  }
}

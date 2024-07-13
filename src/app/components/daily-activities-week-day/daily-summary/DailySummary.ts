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

export interface DailySummary {
  issues: DailySummaryIssue[];
  duration: string;
}

import { DailyActivitiesSummaryIssue } from './DailyActivitiesSummaryIssue';

export interface DailyActivitiesSummary {
  date: Date;
  issues: DailyActivitiesSummaryIssue[];
  duration: string;
}

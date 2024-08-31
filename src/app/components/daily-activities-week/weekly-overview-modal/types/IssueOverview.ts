import { Activity, Issue } from '../../../../dto';
import { ActivityOverview } from './ActivityOverview';

export interface IssueOverview {
  issue: Issue;
  activityOverview: ActivityOverview[];
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

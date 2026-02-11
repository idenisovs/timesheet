import { Activity } from '../Activity';
import { Issue } from '../Issue';
import { ActivityOverview } from './ActivityOverview';

export interface IssueOverview {
  issue: Issue;
  activityOverview: ActivityOverview[];
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

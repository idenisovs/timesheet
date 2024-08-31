import { Issue } from '../../../../dto';
import { ActivityOverview } from './ActivityOverview';

export interface IssueOverview {
  issue: Issue;
  activities: ActivityOverview[];
  duration: string;
  durationRatio: number;
}

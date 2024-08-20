import { Activity, Issue } from '../../../dto';

export interface IssueOverview {
  issue: Issue;
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

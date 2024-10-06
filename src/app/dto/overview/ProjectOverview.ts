import { Project } from '../Project';
import { IssueOverview } from './IssueOverview';
import { Activity } from '../Activity';

export interface ProjectOverview {
  project: Project;
  issues: IssueOverview[];
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

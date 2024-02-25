import { Issue } from '../../../services/Issue';

export interface DailyActivitiesSummary {
  date: Date;
  issues: Issue[];
  duration: string;
}

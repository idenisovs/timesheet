import { Task } from '../../../services/Task';

export interface DailyActivitiesSummary {
  date: Date;
  tasks: Task[];
  duration: string;
}

import { ProjectOverview } from '../../entities';

export interface ActivityTotals {
  activities: number,
  time: string,
  rate: number
}

export interface Analytics {
  projectOverview: ProjectOverview[];
  totals: ActivityTotals;
  weeklyHours: Map<number, number>;
}

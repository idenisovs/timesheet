import { ProjectOverview } from '../../dto';

export interface ActivityTotals {
  activities: number,
  time: string,
  rate: number
}

export interface Analytics {
  projectOverview: ProjectOverview[];
  totals: ActivityTotals;
}

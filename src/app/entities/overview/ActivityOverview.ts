import { Activity } from '../index';

export interface ActivityOverview {
  name: string;
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

import { Activity } from '../../../../dto';

export interface ActivityOverview {
  name: string;
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

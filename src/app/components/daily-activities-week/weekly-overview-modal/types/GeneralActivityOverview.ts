import { Activity } from '../../../../dto';

export interface GeneralActivityOverview {
  name: string;
  activities: Activity[];
  duration: string;
  durationRatio: number;
}

import { Activity } from './Activity';

export interface Sheet {
  id?: number;
  date: Date|string;
  activities: Activity[];
  isMissing?: boolean;
}

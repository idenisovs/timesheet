import { Activity } from './Activity';

export default interface Sheet {
  id?: number;
  date: Date|string;
  activities: Activity[];
}

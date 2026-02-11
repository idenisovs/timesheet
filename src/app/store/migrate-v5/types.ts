import { Activity } from '../../entities';

export interface Sheet {
  id?: number;
  date: Date|string;
  activities: Activity[];
  isMissing?: boolean;
}

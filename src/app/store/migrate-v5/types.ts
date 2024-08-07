import { Activity } from '../../dto';

export interface Sheet {
  id?: number;
  date: Date|string;
  activities: Activity[];
  isMissing?: boolean;
}

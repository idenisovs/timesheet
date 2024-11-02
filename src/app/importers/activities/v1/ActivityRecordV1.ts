import { ActivityRecord } from '../ActivityRecord';

export interface ActivityRecordV1 extends ActivityRecord {
  date: string;
  from: string;
  till: string;
  duration: string;
  weekId: string;
  dayId: string;
  issueId: string;
}

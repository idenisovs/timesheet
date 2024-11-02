import { Activity } from '../../dto';
import { ActivityRecord } from './ActivityRecord';

export interface ActivityReader<T extends ActivityRecord> {
  read(record: T[]): Activity[];
}

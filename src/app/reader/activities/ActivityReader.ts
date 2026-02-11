import { Activity } from '../../entities';
import { ActivityRecord } from './ActivityRecord';

export interface ActivityReader<T extends ActivityRecord> {
  read(record: T[]): Activity[];
}

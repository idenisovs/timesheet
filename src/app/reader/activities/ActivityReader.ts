import { Activity } from '@entities';
import { ActivityRecord } from '@store/records';

export interface ActivityReader<T extends ActivityRecord> {
	read(record: T[]): Activity[];
}

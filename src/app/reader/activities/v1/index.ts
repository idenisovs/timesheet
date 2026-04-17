import { DateTime } from 'luxon';
import { Metadata } from '../../Metadata';
import { ActivityReader } from '../ActivityReader';
import { ActivityRecordV1 } from './ActivityRecordV1';
import { Activity } from '../../../entities';

export * from './ActivityRecordV1';

export class ActivityReaderV1 implements ActivityReader<ActivityRecordV1> {
	metadata: Metadata;

	constructor(metadata: Metadata) {
		this.metadata = metadata;
	}

	public read(records: ActivityRecordV1[]): Activity[] {
		return records.map(this.processRecord.bind(this));
	}

	private processRecord(record: ActivityRecordV1): Activity {
		const activity = new Activity();
		Object.assign(activity, record);
		activity.date = this.processRecordDate(record);
		return activity;
	}

	private processRecordDate(record: ActivityRecordV1): string {
		const date = DateTime.fromISO(record.date).toLocal().toISODate() as string;

		if (!date) {
			const error = `Invalid date format: ${record.date} for activity: ${record.id}:${record.name}!`;
			throw new Error(error);
		}

		return date;
	}
}

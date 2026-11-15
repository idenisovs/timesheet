import { DateTime } from 'luxon';
import { Metadata } from '../../Metadata';
import { ActivityReader } from '../ActivityReader';
import { Activity } from '@entities';
import { ActivityRecord } from '@store/records';


export class ActivityReaderV1 implements ActivityReader<ActivityRecord> {
	metadata: Metadata;

	constructor(metadata: Metadata) {
		this.metadata = metadata;
	}

	public read(records: ActivityRecord[]): Activity[] {
		return records.map(this.processRecord.bind(this));
	}

	private processRecord(record: ActivityRecord): Activity {
		const activity = new Activity();
		activity.id = record.id;
		activity.name = record.name;
		activity.date = this.processRecordDate(record);
		activity.from = record.from;
		activity.till = record.till;
		activity.duration = record.duration;
		activity.color = record.color;
		return activity;
	}

	private processRecordDate(record: ActivityRecord): string {
		const date = DateTime.fromISO(record.date).toLocal().toISODate() as string;

		if (!date) {
			const error = `Invalid date format: ${record.date} for activity: ${record.id}:${record.name}!`;
			throw new Error(error);
		}

		return date;
	}
}

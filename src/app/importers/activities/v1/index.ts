import { Metadata } from '../../Metadata';
import { ActivityReader } from '../ActivityReader';
import { ActivityRecordV1 } from './ActivityRecordV1';
import { Activity } from '../../../dto';

export * from './ActivityRecordV1';

export class ActivityReaderV1 implements ActivityReader<ActivityRecordV1> {
	metadata: Metadata;

	constructor(metadata: Metadata) {
		this.metadata = metadata;
	}

	public read(records: ActivityRecordV1[]): Activity[] {
		return records.map(this.processRecord);
	}

	private processRecord(record: ActivityRecordV1): Activity {
		const activity = new Activity();
		Object.assign(activity, record);
		activity.date = new Date(record.date);
		return activity;
	}
}

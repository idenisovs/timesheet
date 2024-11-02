import { Metadata } from '../Metadata';
import { ActivityReader } from './ActivityReader';
import { ActivityRecord } from './ActivityRecord';
import { ActivityReaderV1 } from './v1';
import { Activity } from '../../dto';

export class ActivityReaderFactory {
  private readonly metadata = new Metadata();
  private reader: ActivityReader<ActivityRecord>;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
    this.reader = this.getImporter();
  }

  read(records: ActivityRecord[]): Activity[] {
    return this.reader.read(records);
  }

  private getImporter(): ActivityReader<ActivityRecord> {
    switch (this.metadata.activities.version) {
      case 1:
        return new ActivityReaderV1(this.metadata);
      default:
        throw new Error('This version of activity reader is not supported!');
    }
  }
}

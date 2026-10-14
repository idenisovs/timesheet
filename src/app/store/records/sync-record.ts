import { ActivityRecord } from '@store/records/activity-record';
import { IssueRecord } from '@store/migrate-v7/types';
import { ProjectRecord } from '@store/records/project-record';

export interface SyncRecord {
	id: number;
	entityType: string;
	entityId: string;
	raw: ActivityRecord | IssueRecord | ProjectRecord | null;
}

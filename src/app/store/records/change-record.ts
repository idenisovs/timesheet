import { ProjectRecord } from '@store/records/project-record';
import { IssueRecord } from '@store/records/issue-record';
import { ActivityRecord } from '@store/records/activity-record';

type ChangesEntity = ProjectRecord | IssueRecord | ActivityRecord;

export interface ChangeRecord {
	id: string;
	entity: 'project' | 'issue' | 'activity';
	entityId: string;
	before: ChangesEntity | null;
	after: ChangesEntity | null;
	status: 'pending' | 'synced';
	syncedAt: Date | null;
	createdAt: Date;
}

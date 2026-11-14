import { ProjectRecord } from '@store/records/project-record';
import { IssueRecord } from '@store/records/issue-record';
import { ActivityRecord } from '@store/records/activity-record';

type ChangesEntity = ProjectRecord | IssueRecord | ActivityRecord;

export interface ChangeRecord {
	id: string;
	entity: 'project' | 'issue' | 'activity';
	before: ChangesEntity | null;
	after: ChangesEntity | null;
	addedOn: Date;
	syncedOn: Date | null;
}

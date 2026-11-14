import Dexie, { Transaction } from 'dexie';
import {
	ActivityRecord,
	IssueRecord,
	ProjectRecord,
	ChangeRecord,
} from '@store/records';

type EntityType = 'project' | 'issue' | 'activity';
type ChangedEntityRecord = ProjectRecord | IssueRecord | ActivityRecord;

function createChangeRecord(entity: EntityType, record: ChangedEntityRecord): ChangeRecord {
	return {
		id: crypto.randomUUID(),
		entity: entity,
		before: null,
		after: record,
		addedOn: new Date(),
		syncedOn: null,
	};
}

export default async function migrateV17(tx: Transaction) {
	console.info('Running Migration V17: Introducing the Changes table!');
	const changesTable = tx.table('changes') as Dexie.Table<ChangeRecord, string>;
	const projectTable = tx.table('projects') as Dexie.Table<ProjectRecord, string>;

	console.log('Saving the Project changes!');
	await projectTable.each(async (record: ProjectRecord) => {
		await changesTable.add(createChangeRecord('project', record));
	});

	console.log('Saving the Issue changes!');
	const issueTable = tx.table('issues') as Dexie.Table<IssueRecord, string>;

	await issueTable.each(async (record: IssueRecord) => {
		await changesTable.add(createChangeRecord('issue', record));
	});

	console.log('Saving the Activity changes!');
	const activityTable = tx.table('activities') as Dexie.Table<ActivityRecord, string>;

	await activityTable.each(async (record: ActivityRecord) => {
		await changesTable.add(createChangeRecord('activity', record));
	});
};

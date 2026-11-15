import Dexie, { Transaction } from 'dexie';

import { ProjectRecord, IssueRecord, ActivityRecord } from './records';

import { ChangeRecord } from '@store/records/change-record';
import migrateV16 from './migrate-v16';
import migrateV17 from '@store/migrate-v17';

export default class SheetStore extends Dexie {
	issues: Dexie.Table<IssueRecord, string>;
	projects: Dexie.Table<ProjectRecord, string>;
	activities: Dexie.Table<ActivityRecord, string>;
	changes: Dexie.Table<ChangeRecord, string>;

	constructor() {
		super('timesheet');

		this.version(15).stores({
			activities: '&id,name,date,from,till,issueId',
			issues: '&id,&key,name,activities,createdAt',
			projects: '&id,&name,*keys,createdAt'
		});

		this.version(16).upgrade((tx: Transaction) => migrateV16(tx));

		this.version(17).stores({
			changes: '&id,entity,createdAt,syncedAt'
		}).upgrade((tx: Transaction) => migrateV17(tx));


		this.projects = this.table('projects');
		this.issues = this.table('issues');
		this.activities = this.table('activities');
		this.changes = this.table('changes');
	}
}

import { Transaction } from 'dexie';

import SheetStore from './SheetStore';
import { IssueRecord } from './records';

export default function migrateV15(store: SheetStore) {
	const isV15required = !localStorage.getItem('is_v15_done');

	isV15required && console.info('Running the migrations to solve the primary key type problem of Issue table!');
	isV15required && console.debug('Running V12: Move issue records to a tmp table!');

	store.version(12).stores({
		issuesTmp: '&id,&key,name,activities,createdAt',
	}).upgrade(async (tx: Transaction) => {
		const issueRecords = await tx.table('issues').toArray() as IssueRecord[];
		await tx.table('issuesTmp').bulkPut(issueRecords);
		console.debug('V12 transaction completed!');
	});

	isV15required && console.debug('Running V13: Removing the old issue table!');
	store.version(13).stores({
		issues: null
	});

	isV15required && console.debug('Running V14: Recreate Issues table!');
	store.version(14).stores({
		issues: '&id,&key,name,activities,createdAt'
	}).upgrade(async (tx: Transaction) => {
		const issueRecords = await tx.table('issuesTmp').toArray() as IssueRecord[];
		await tx.table('issues').bulkPut(issueRecords);
		console.debug('V14 transaction completed!');
	});
	

	isV15required && console.debug('Running V15: Removing the tmp issue table!');
	store.version(15).stores({
		issuesTmp: null
	});

	localStorage.setItem('is_v15_done', 'yes');
}

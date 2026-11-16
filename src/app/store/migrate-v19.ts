import { Transaction } from 'dexie';
import { ChangeRecord } from '@store/records';

export default async function migrateV19(tx: Transaction) {
	await tx.table('changes').toCollection().modify((change: ChangeRecord) => {
		if (change.after) {
			change.entityId = change.after.id;
		} else if (change.before) {
			change.entityId = change.before.id;
		}
	});
}

import { Transaction } from 'dexie';
import { ChangeRecord } from '@store/records';

export default async function migrateV20(tx: Transaction) {
	await tx.table('changes').toCollection().modify((change: ChangeRecord) => {
		change.status = change.syncedAt === null ? 'pending' : 'synced';
	});
}

import { Transaction } from 'dexie';

export default async function migrateV21(tx: Transaction) {
	const now = new Date();

	for (const table of ['activities', 'issues', 'projects']) {
		await tx.table(table).toCollection().modify(record => {
			record.createdAt ??= now;
			record.updatedAt ??= record.createdAt;
		});
	}
}

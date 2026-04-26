import { Transaction } from 'dexie';

import SheetStore from './SheetStore';

const CHUNK_SIZE = 500;

export default async function migrateV11(_store: SheetStore, tx: Transaction) {
	const table = tx.table('activities');
	let offset = 0;

	while (true) {
		const chunk = await table.offset(offset).limit(CHUNK_SIZE).toArray();

		if (chunk.length === 0) break;

		for (const activity of chunk as Record<string, unknown>[]) {
			delete activity['weekId'];
			delete activity['dayId'];
		}

		await table.bulkPut(chunk);
		offset += chunk.length;
	}
}

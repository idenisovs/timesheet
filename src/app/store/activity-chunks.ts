import { Table } from 'dexie';

import { ActivityRecord } from './records';

const CHUNK_SIZE = 500;

export async function* activityChunks(table: Table): AsyncGenerator<ActivityRecord[]> {
	let offset = 0;

	while (true) {
		const chunk: ActivityRecord[] = await table.offset(offset).limit(CHUNK_SIZE).toArray();

		if (chunk.length === 0) break;

		yield chunk;

		offset += chunk.length;
	}
}

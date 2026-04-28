import Dexie, { Transaction } from 'dexie';

import { ColorsService } from '../services/colors.service';
import { ActivityRecord } from './records';
import { activityChunks } from './activity-chunks';

export default async function migrateV16(tx: Transaction) {
	const colorsService = new ColorsService();

	const activityTable = tx.table('activities') as Dexie.Table<ActivityRecord, string>;
	const nameColorMap = new Map<string, string>();

	for await (const chunk of activityChunks(activityTable)) {
		chunk.forEach((record: ActivityRecord) => {
			if (!nameColorMap.has(record.name)) {
				nameColorMap.set(record.name, colorsService.getNextColor());
			}

			record.color = nameColorMap.get(record.name);
		});

		await activityTable.bulkPut(chunk);
	}
}

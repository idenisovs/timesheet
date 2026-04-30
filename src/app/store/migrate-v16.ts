import Dexie, { Transaction } from 'dexie';

import { ColorsService } from '../services/colors.service';
import { ActivityRecord } from './records';
import { paginateTable } from './paginate-table';

function extractPrefix(name: string): string | null {
	const colonIndex = name.indexOf(':');
	return colonIndex !== -1 ? name.slice(0, colonIndex) : null;
}

export default async function migrateV16(tx: Transaction) {
	const colorsService = new ColorsService();

	const activityTable = tx.table('activities') as Dexie.Table<ActivityRecord, string>;
	const prefixColorMap = new Map<string, string>();
	const nameColorMap = new Map<string, string>();

	for await (const page of paginateTable(activityTable)) {
		page.forEach((record: ActivityRecord) => {
			const prefix = extractPrefix(record.name);

			if (prefix != null) {
				if (!prefixColorMap.has(prefix)) {
					prefixColorMap.set(prefix, colorsService.getNextColorHsl());
				}

				record.color = prefixColorMap.get(prefix);
			} else {
				if (!nameColorMap.has(record.name)) {
					nameColorMap.set(record.name, colorsService.getNextColorHsl());
				}

				record.color = nameColorMap.get(record.name);
			}
		});

		await activityTable.bulkPut(page);
	}
}

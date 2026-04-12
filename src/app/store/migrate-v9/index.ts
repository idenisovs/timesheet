import { Transaction } from 'dexie';
import { DateTime } from 'luxon';

import SheetStore from '../SheetStore';

export default async function migrateV9(store: SheetStore, trans: Transaction) {
	const weeks = await trans.table('weeks').toArray();

	for (const week of weeks) {
		week.from = DateTime.fromISO(week.from).toLocal().toISODate();
		week.till = DateTime.fromISO(week.till).toLocal().toISODate();
		await trans.table('weeks').update(week.id, week);
	}
}

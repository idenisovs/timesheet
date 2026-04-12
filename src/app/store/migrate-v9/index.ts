import { Transaction } from 'dexie';
import { DateTime } from 'luxon';

import SheetStore from '../SheetStore';
import { DayRecord, WeekRecord } from '../records';

function getIsoDate(date: string) {
	const result = DateTime.fromISO(date).toLocal().toISODate();

	if (result === null) {
		throw new Error(`${date} is not a valid date.`);
	}

	return result;
}

export default async function migrateV9(store: SheetStore, trans: Transaction) {
	console.log('Migrate Week records!')

	const weeks: WeekRecord[] = await trans.table('weeks').toArray();

	for (const week of weeks) {
		week.from = getIsoDate(week.from);
		week.till = getIsoDate(week.till);
		await trans.table('weeks').update(week.id, week);
	}

	console.log('Migrate Day records!')

	const days: DayRecord[] = await trans.table('days').toArray();

	for (const day of days) {
		day.date = getIsoDate(day.date);
		await trans.table('days').update(day.id, day);
	}
}

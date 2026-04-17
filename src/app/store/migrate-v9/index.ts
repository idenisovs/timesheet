import { Transaction } from 'dexie';
import { DateTime } from 'luxon';

import SheetStore from '../SheetStore';
import { DayRecord, WeekRecord } from './types';

function getIsoDate(date: Date | string) {
	let result: string | null;

	if (date instanceof Date) {
		result = DateTime.fromJSDate(date).toLocal().toISODate();
	} else {
		result = DateTime.fromISO(date).toLocal().toISODate();
	}

	if (result === null) {
		throw new Error(`${date} is not a valid date.`);
	}

	return result;
}

export default async function migrateV9(store: SheetStore, trans: Transaction) {
	console.log('Migrate Week records!');

	const weeks: WeekRecord[] = await trans.table('weeks').toArray();

	for (const week of weeks) {
		const update = { ...week };

		update.from = getIsoDate(week.from);
		update.till = getIsoDate(week.till);

		try {
			await trans.table('weeks').update(week.id, update);
		} catch (e) {
			console.error(e);
			console.log(week);
			console.log(update);
			throw e;
		}
	}

	console.log('Week records migration completed!');

	console.log('Migrate Day records!');

	const days: DayRecord[] = await trans.table('days').toArray();

	for (const day of days) {
		const update = { ...day };
		update.date = getIsoDate(day.date);

		try {
			await trans.table('days').update(day.id, update);
		} catch (e) {
			console.error(e);
			console.log(day);
			console.log(update);
			throw e;
		}
	}

	console.log('Day records migration completed!');


	console.log('Migrate Activity records!');

	const activities = await trans.table('activities').toArray();

	for (const activity of activities) {
		const update = { ...activity };
		update.date = getIsoDate(activity.date);

		try {
			await trans.table('activities').update(activity.id, update);
		} catch (e) {
			console.error(e);
			console.log(activity);
			console.log(update);
			throw e;
		}
	}

	console.log('Activity records migration completed!');
}

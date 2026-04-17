import { DateTime } from 'luxon';

import { Week } from '../entities';

export function getMonday(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const result = DateTime.fromJSDate(d).startOf('week').toISODate();

	if (!result) {
		throw new Error(`${date} is not a valid date.`);
	}

	return result;
}

export function getSunday(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const result = DateTime.fromJSDate(d).endOf('week').toISODate();

	if (!result) {
		throw new Error(`${date} is not a valid date.`);
	}

	return result;
}

export function getDateIso(date: Date): string {
	const result = DateTime.fromJSDate(date).toISODate();

	if (result === null) {
		throw new Error(`${date} is not a valid date.`);
	}

	return result;
}

export function getCurrentDateIso(): string {
	return getDateIso(new Date());
}

export function getCurrentWeek(): Week {
	return new Week();
}

export function getPreviousWeek(week: Week): Week {
	const prevMonday = DateTime.fromISO(week.from).minus({ weeks: 1 }).toISODate() as string;
	return new Week(prevMonday);
}

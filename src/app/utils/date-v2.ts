import { DateTime } from 'luxon';

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

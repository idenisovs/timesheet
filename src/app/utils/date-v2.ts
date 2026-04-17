import { DateTime } from 'luxon';

import { Day, Week } from '../entities';

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
	const prevMonday = DateTime.fromISO(week.start).minus({ weeks: 1 }).toISODate() as string;
	return new Week(prevMonday);
}

export function getDaysByWeek(week: Week, desc = false): Day[] {
	const days: Day[] = [];

	let currentDate = week.start;

	while (currentDate <= week.end) {
		days.push(new Day(currentDate));
		currentDate = DateTime.fromISO(currentDate).plus({ days: 1 }).toISODate() as string;
	}

	if (desc) {
		days.sort((a, b) => -a.date.localeCompare(b.date));
	}

	return days;
}

export function getDaysByRange(from: string, till: string): Day[] {
	const days: Day[] = [];

	let currentDate = from;

	while (currentDate <= till) {
		days.push(new Day(currentDate));
		currentDate = DateTime.fromISO(currentDate).plus({ days: 1 }).toISODate() as string;
	}

	return days;
}

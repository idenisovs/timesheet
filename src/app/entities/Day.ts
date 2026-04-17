import { getCurrentDate } from '../utils/date-v2';
import { DateTime } from 'luxon';

export class Day {
	date: string = getCurrentDate();

	constructor(date?: string) {
		if (!date) {
			return;
		}

		const update = DateTime.fromISO(date).toLocal().toISODate();

		if (update == null) {
			throw new Error(`Invalid date: ${date}`);
		}

		this.date = update;
	}
}

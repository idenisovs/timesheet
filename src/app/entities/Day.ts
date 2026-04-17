import { getCurrentDateIso, getDateIso } from '../utils/date-v2';

export class Day {
	date: string = getCurrentDateIso();
	weekId: string = '';

	constructor(date?: Date | string) {
		if (!date) {
			return;
		}

		if (typeof date === 'string') {
			this.date = date;
		} else {
			this.date = getDateIso(date);
		}
	}
}

import { DayRecord } from '../store/records';
import { getCurrentDateIso, getDateIso } from '../utils/date-v2';

export class Day {
	id: string = crypto.randomUUID();
	date: string = getCurrentDateIso();
	weekId: string = '';
	isMissing?: boolean;

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

	static fromRecord(source: DayRecord): Day {
		const day = new Day();
		Object.assign(day, source);
		return day;
	}

	static toRecord(source: Day): DayRecord {
		const { id, date, weekId } = source;

		return {
			id,
			date,
			weekId,
		};
	}
}

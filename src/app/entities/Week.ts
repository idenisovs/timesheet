import { getCurrentDateIso, getMonday, getSunday } from '../utils/date-v2';
import { WeekRecord } from '../store/records';

export class Week {
	id: string = crypto.randomUUID();
	start: string;
	end: string;

	constructor(date = getCurrentDateIso()) {
		this.start = getMonday(date);
		this.end = getSunday(date);
	}

	static fromRecord(record: WeekRecord): Week {
		const week = new Week();
		Object.assign(week, record);
		return week;
	}

	static toRecord(source: Week): WeekRecord {
		return {
			id: source.id,
			from: source.start,
			till: source.end,
		};
	}
}

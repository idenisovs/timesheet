import { getMonday, getSunday } from '../utils/date-v2';
import { WeekRecord } from '../store/records';

export class Week {
	id: string = crypto.randomUUID();
	from: string;
	till: string;

	constructor(date = new Date()) {
		this.from = getMonday(date);
		this.till = getSunday(date);
	}

	static fromRecord(record: WeekRecord): Week {
		const week = new Week();
		Object.assign(week, record);
		return week;
	}

	static toRecord(source: Week): WeekRecord {
		return { ...source };
	}
}

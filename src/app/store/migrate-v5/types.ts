import { endOfDay, getMonday, getSunday, startOfDay } from '../../utils';

export interface Sheet {
  id?: number;
  date: Date|string;
  activities: Activity[];
  isMissing?: boolean;
}

export interface WeekRecord {
	id: string;
	from: string;
	till: string;
}

export class Week {
	id: string = crypto.randomUUID();
	from: Date;
	till: Date;

	constructor(date = new Date()) {
		this.from = startOfDay(getMonday(date));
		this.till = endOfDay(getSunday(date));
	}

	static build(source: WeekRecord): Week {
		const week = new Week();

		week.id = source.id;
		week.from = new Date(source.from);
		week.till = new Date(source.till);

		return week;
	}

	static entity(source: Week): WeekRecord {
		const { id, from, till } = source;

		return {
			id,
			from: from.toISOString(),
			till: till.toISOString()
		};
	}
}

export interface DayRecord {
	id: string;
	date: Date;
	weekId: string;
}

export class Day {
	id: string = crypto.randomUUID();
	date: Date = new Date();
	weekId: string = '';
	isMissing?: boolean;

	constructor(date?: Date) {
		if (date) {
			this.date = new Date(date);
		}

		this.date.setHours(0, 0, 0, 0);
	}

	static fromRecord(source: DayRecord): Day {
		const day = new Day();
		Object.assign(day, source);
		day.date = new Date(source.date);
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

export class Activity {
	id = crypto.randomUUID() as string;
	name = '';
	date = new Date();
	from = '';
	till = '';
	duration = '';
	weekId = '';
	dayId = '';
	issueId?: string;

	constructor(entity?: Activity) {
		if (!entity) {
			return;
		}

		Object.assign(this, entity);
	}
}

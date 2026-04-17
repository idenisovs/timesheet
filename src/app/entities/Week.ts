import { getCurrentDateIso, getMonday, getSunday } from '../utils/date-v2';

export class Week {
	id: string = crypto.randomUUID();
	start: string;
	end: string;

	constructor(date = getCurrentDateIso()) {
		this.start = getMonday(date);
		this.end = getSunday(date);
	}
}

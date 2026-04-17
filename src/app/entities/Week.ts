import { getCurrentDate, getMonday, getSunday } from '../utils/date-v2';

export class Week {
	start: string;
	end: string;

	constructor(date = getCurrentDate()) {
		this.start = getMonday(date);
		this.end = getSunday(date);
	}
}

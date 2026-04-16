import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Week } from '../entities';

@Injectable({
	providedIn: 'root',
})
export class CalendarService {
	getCurrentWeek(): Week {
		return new Week();
	}

	getPreviousWeek(week: Week): Week {
		const prevMonday = DateTime.fromISO(week.from).minus({ weeks: 1 }).toJSDate();
		return new Week(prevMonday);
	}
}

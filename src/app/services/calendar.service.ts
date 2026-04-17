import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Week } from '../entities';
import { getCurrentDateIso } from '../utils/date-v2';

@Injectable({
	providedIn: 'root',
})
export class CalendarService {
	getCurrentWeek(): Week {
		return new Week();
	}

	getPreviousWeek(week: Week): Week {
		const prevMonday = DateTime.fromISO(week.from).minus({ weeks: 1 }).toISODate() as string;
		return new Week(prevMonday);
	}

	getCurrentDate(): string {
		return getCurrentDateIso();
	}
}

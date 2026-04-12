import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { Day, Week } from '../entities';

@Injectable({
	providedIn: 'root',
})
export class DaysService {
	addMissingDays(week: Week, days: Day[]) {
		console.log('addMissingDays');
		console.log(days);

		let currentDate = week.till;

		for (let idx = 0; idx < 7; idx++) {
			const day = days[idx];

			if (!day || day.date < currentDate) {
				const missingDay = new Day(currentDate);
				missingDay.weekId = week.id;
				missingDay.isMissing = true;
				days.splice(idx, 0, missingDay);
			}

			currentDate = DateTime.fromISO(currentDate).minus({ days: 1 }).toISODate() as string;
		}
	}

	removeMissingDays(days: Day[]) {
		for (let idx = 0; idx < 7; idx++) {
			const day = days[idx];

			if (!day) {
				continue;
			}

			if (day.isMissing) {
				days.splice(idx, 1);
				idx--;
			}
		}
	}
}

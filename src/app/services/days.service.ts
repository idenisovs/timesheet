import { Injectable } from '@angular/core';

import { Day, Week } from '../dto';
import { startOfDay } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DaysService {
  constructor() { }

  addMissingDays(week: Week, days: Day[]) {
    let expectedDate = startOfDay(week.till);

    for (let idx = 0; idx < 7; idx++) {
      const day = days[idx];

      if (!day || day.date < expectedDate) {
        const missingDay = new Day(expectedDate);
        missingDay.weekId = week.id;
        missingDay.isMissing = true;
        days.splice(idx, 0, missingDay);
      }

      expectedDate.setDate(expectedDate.getDate() - 1);
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

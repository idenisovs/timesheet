import { Injectable } from '@angular/core';
import { Day, Week } from '../dto';
import { getDateString, startOfDay } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DaysService {
  constructor() { }

  findByDate(days: Day[], date: Date): Day | undefined {
    const targetDate = getDateString(date);

    return days.find((day: Day) => {
      return targetDate === getDateString(day.date);
    });
  }

  addMissingDays(week: Week, days: Day[]) {
    const expectedDate = startOfDay(week.till);

    for (let idx = 0; idx < 7; idx++) {
      const day = days[idx];

      if (day.date === expectedDate) {
        continue;
      }

    }
  }
}

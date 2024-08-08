import { Injectable } from '@angular/core';

import { Day, Week, DaysSummary } from '../dto';
import { calculateTotalDuration, getDateString } from '../utils';

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

  getSummary(days: Day[]): DaysSummary {
    const initialValues: DaysSummary = {
      activities: 0,
      duration: 0
    };

    return days.reduce<DaysSummary>((result: DaysSummary, day: Day) => {
      result.duration += calculateTotalDuration(day.activities);
      result.activities += day.activities.length;
      return result;
    }, initialValues);
  }

  addMissingDays(week: Week, days: Day[]) {
    const expectedDate = new Date(week.from);

    for (let idx = 0; idx < 7; idx++) {
      const day = days[idx];

      if (!day || day.date > expectedDate) {
        const missingDay = new Day(expectedDate);
        missingDay.isMissing = true;
        days.splice(idx, 0, missingDay);
      }

      expectedDate.setDate(expectedDate.getDate() + 1);
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

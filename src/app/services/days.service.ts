import { Injectable } from '@angular/core';

import { Day, Week, DaysSummary } from '../dto';
import { calculateTotalDuration, getDateString, startOfDay } from '../utils';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';

@Injectable({
  providedIn: 'root'
})
export class DaysService {
  constructor(
    private activityRepository: ActivitiesRepositoryService
  ) { }

  findByDate(days: Day[], date: Date): Day | undefined {
    const targetDate = getDateString(date);

    return days.find((day: Day) => {
      return targetDate === getDateString(day.date);
    });
  }

  async getSummary(days: Day[]): Promise<DaysSummary> {
    const result: DaysSummary = {
      activities: 0,
      duration: 0
    };

    for (let day of days) {
      const activities = await this.activityRepository.getByDay(day);
      result.activities += activities.length;
      result.duration += calculateTotalDuration(activities);
    }

    return result;
  }

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

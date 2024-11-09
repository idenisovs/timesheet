import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import parseDuration from 'parse-duration';

import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Activity, Day, ProjectOverview } from '../../dto';
import { AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { DaysRepositoryService } from '../../repository/days-repository.service';
import { OverviewService } from '../../services/overview.service';
import { ActivityTotals, Analytics } from './types';
import { DurationService } from '../../services/duration.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageService {
  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private dayRepository: DaysRepositoryService,
    private overviewService: OverviewService,
    private durationService: DurationService
  ) { }

  async getAnalytics(filters: AnalyticsPageFilters): Promise<Analytics> {
    const days = await this.getDays(filters);
    const activities = await this.activityRepository.getByDays(days);
    const projectOverview = await this.overviewService.getProjectOverview(activities)
    const totals = this.calculateTotals(projectOverview);
    const weeklyHours = this.calculateWeeklyHours(activities);

    console.log(weeklyHours);

    return {
      projectOverview, totals
    }
  }

  async getDays(filters: AnalyticsPageFilters): Promise<Day[]> {
    if (!filters.from && !filters.till) {
      return this.dayRepository.getAll();
    }

    if (filters.from && filters.till) {
      return this.dayRepository.getByRange(filters.from, filters.till);
    }

    throw new Error('Filter functionality is not fully implemented yet!');
  }

  calculateTotals(projectOverview: ProjectOverview[]) {
    return projectOverview.reduce((result: ActivityTotals, projectOverview: ProjectOverview) => {
      result.activities += projectOverview.activities.length;
      result.time = this.durationService.sum([result.time, projectOverview.duration]);
      result.rate += projectOverview.durationRatio;
      return result;
    }, { activities: 0, time: '0', rate: 0 });
  }

  calculateWeeklyHours(activities: Activity[]) {
    const weeklyHours = new Map<number, number>();

    for (const activity of activities) {
      const weekNumber = DateTime.fromJSDate(activity.date).weekNumber;
      const activityTimeMs = parseDuration(activity.duration) ?? 0;
      const workedTime = weeklyHours.get(weekNumber) ?? 0;
      weeklyHours.set(weekNumber, workedTime + activityTimeMs);
    }

    return weeklyHours;
  }
}

import { Injectable } from '@angular/core';

import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Day, ProjectOverview } from '../../dto';
import { AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { DaysRepositoryService } from '../../repository/days-repository.service';
import { OverviewService } from '../../services/overview.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageService {
  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private dayRepository: DaysRepositoryService,
    private overviewService: OverviewService
  ) { }

  async getAnalytics(filters: AnalyticsPageFilters): Promise<ProjectOverview[]> {
    const days = await this.getDays(filters);
    const activities = await this.activityRepository.getByDays(days);
    return await this.overviewService.getProjectOverview(activities)
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
}

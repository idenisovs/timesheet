import { Injectable } from '@angular/core';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Activity, Day } from '../../dto';
import { AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { DaysRepositoryService } from '../../repository/days-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageService {

  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private dayRepository: DaysRepositoryService
  ) { }

  async getAnalytics(filters: AnalyticsPageFilters): Promise<Activity[]> {
    const days = await this.getDays(filters);
    return this.activityRepository.getByDays(days);
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

import { Injectable } from '@angular/core';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Activity } from '../../dto';
import { AnalyticsPageFilters } from './AnalyticsPageFilters';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageService {

  constructor(
    private activityRepository: ActivitiesRepositoryService
  ) { }

  async getAnalytics(filters: Partial<AnalyticsPageFilters>): Promise<Activity[]> {
    return await this.activityRepository.getAll(false) as Activity[];
  }
}

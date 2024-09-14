import { Injectable } from '@angular/core';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { Activity } from '../../dto';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageService {

  constructor(
    private activityRepository: ActivitiesRepositoryService
  ) { }

  async getAnalytics(): Promise<Activity[]> {
    return await this.activityRepository.getAll(false) as Activity[];
  }
}

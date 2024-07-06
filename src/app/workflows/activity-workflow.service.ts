import { Injectable } from '@angular/core';

import {Activity} from '../dto';
import {ActivitiesRepositoryService} from '../repository/activities-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityWorkflowService {

  constructor(
    private activitiesRepository: ActivitiesRepositoryService
  ) { }

  async save(activities: Activity[]) {
    await this.activitiesRepository.save(activities);
  }

  async remove(activityIds: string[]) {
    await this.activitiesRepository.remove(activityIds);
  }
}

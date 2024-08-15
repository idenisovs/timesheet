import { Injectable } from '@angular/core';

import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { Activity, Week } from '../../../dto';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';

@Injectable({
  providedIn: 'root'
})
export class WeeklyOverviewModalService {

  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private issueRepository: IssueRepositoryService
  ) { }

  async run(week: Week) {
    const activities = await this.activityRepository.getByWeek(week);
    const issueKeys = this.getIssueKeys(activities);
    const issues = await this.issueRepository.getAllByKeys(issueKeys);
    console.log(issues);
  }

  getIssueKeys(activities: Activity[]): string[] {
    const issueKeys = activities.map((activity: Activity) => activity.getIssueKey()).filter(key => !!key) as string[];
    const uniqueIssueKeys = new Set(issueKeys);
    return Array.from(uniqueIssueKeys);
  }
}

import { Injectable } from '@angular/core';

import { Activity, Day, Issue } from '../dto';
import {ActivitiesRepositoryService} from '../repository/activities-repository.service';
import { ActivitiesService } from '../services/activities.service';
import { IssueRepositoryService } from '../repository/issue-repository.service';
import { DaysRepositoryService } from '../repository/days-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityWorkflowService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private dayRepository: DaysRepositoryService,
    private activitiesRepository: ActivitiesRepositoryService,
    private activitiesService: ActivitiesService
  ) { }

  public async save(day: Day, activities: Activity[], removableActivityIds: string[]) {
    await this.createDayIfNotExists(day);
    await this.activitiesRepository.remove(removableActivityIds);
    await this.activitiesRepository.save(activities);
    await this.updateIssues(activities);
  }

  private async createDayIfNotExists(day: Day) {
    const existingDay = await this.dayRepository.getById(day.id);

    if (!existingDay) {
      await this.dayRepository.create(day);
    }
  }

  public async remove(activityIds: string[]) {
    await this.activitiesRepository.remove(activityIds);
  }

  private async updateIssues(activities: Activity[]) {
    const issueKeys = this.activitiesService.getIssueKeys(activities);

    for (const issueKey of issueKeys) {
      if (!issueKey.match(/^\w+-\d+/)) {
        continue;
      }

      const activityGroup = await this.activitiesRepository.getByIssueKey(issueKey);

      let issue = await this.issueRepository.getByKey(issueKey);

      if (!issue) {
        const firstActivity = activityGroup[activityGroup.length-1];
        issue = new Issue({
          key: issueKey,
          name: this.activitiesService.getShortName(firstActivity.name),
          createdAt: firstActivity.date
        });
      }

      issue.activities = activityGroup.map(activity => activity.id);
      issue.duration = this.activitiesService.calculateDuration(activityGroup);

      await this.issueRepository.update(issue);
    }
  }
}

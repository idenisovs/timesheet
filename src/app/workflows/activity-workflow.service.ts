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
    await this.activitiesRepository.remove(removableActivityIds);
    await this.createDayIfNotExists(day);
    await this.activitiesRepository.save(activities);
    await this.processAffectedIssues(activities);
  }

  private async createDayIfNotExists(day: Day) {
    const existingDay = await this.dayRepository.getById(day.id);

    if (!existingDay) {
      await this.dayRepository.create(day);
    }
  }

  private async processAffectedIssues(activities: Activity[]) {
    const issueKeys = this.activitiesService.getIssueKeys(activities);

    for (const issueKey of issueKeys) {
      if (!issueKey.match(/^\w+-\d+/)) {
        continue;
      }

      await this.updateIssue(issueKey);
    }
  }

  private async updateIssue(issueKey: string) {
    let issue = await this.issueRepository.getByKey(issueKey);
    const activities = await this.activitiesRepository.getByIssueKey(issueKey);

    if (!issue) {
      issue = this.createMissingIssue(issueKey, activities);
    }

    issue.activities = activities.map(activity => activity.id);
    issue.duration = this.activitiesService.calculateDuration(activities);

    await this.issueRepository.update(issue);
  }

  private createMissingIssue(issueKey: string, activities: Activity[]) {
    const firstActivity = activities[activities.length-1];

    return new Issue({
      key: issueKey,
      name: this.activitiesService.getShortName(firstActivity.name),
      createdAt: firstActivity.date
    });
  }
}

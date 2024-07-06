import { Injectable } from '@angular/core';

import { Activity } from '../dto';
import {ActivitiesRepositoryService} from '../repository/activities-repository.service';
import { ActivitiesService } from '../services/activities.service';
import { IssueRepositoryService } from '../repository/issue-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityWorkflowService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private activitiesRepository: ActivitiesRepositoryService,
    private activitiesService: ActivitiesService
  ) { }

  public async save(activities: Activity[]) {
    await this.activitiesRepository.save(activities);
    await this.processIssues(activities);
  }

  public async remove(activityIds: string[]) {
    await this.activitiesRepository.remove(activityIds);
  }

  private async processIssues(activities: Activity[]) {
    const issueKeys = this.activitiesService.getIssueKeys(activities);

    for (const issueKey of issueKeys) {
      const activityGroup = await this.activitiesRepository.getByIssueKey(issueKey);
      let issue = await this.issueRepository.getByKey(issueKey);

      if (!issue) {
        issue = await this.createIssue(issueKey, activityGroup[0].name);
      }

      issue.duration = this.activitiesService.calculateDuration(activityGroup);
      await this.issueRepository.update(issue);
    }
  }

  private async createIssue(key: string, name: string) {
    return this.issueRepository.create({
      id: crypto.randomUUID() as string,
      key,
      name,
      activities: [],
      duration: '0m',
      createdAt: new Date()
    });
  }
}

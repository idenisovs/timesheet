import { Injectable } from '@angular/core';

import { IssueRepositoryService } from '../repository/issue-repository.service';
import { DaysRepositoryService } from '../repository/days-repository.service';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';
import { ActivitiesService } from '../services/activities.service';
import { Activity, Day, Issue, Week } from '../dto';
import { WeeksRepositoryService } from '../repository/weeks-repository.service';

@Injectable({
  providedIn: 'root'
})
export class SaveActivitiesWorkflowService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private dayRepository: DaysRepositoryService,
    private activitiesRepository: ActivitiesRepositoryService,
    private activitiesService: ActivitiesService,
    private weekRepo: WeeksRepositoryService
  ) { }

  public async run(day: Day, activities: Activity[]) {
    const affectedIssueIds = await this.relink(activities);
    await this.activitiesRepository.save(activities);
    await this.updateAffectedIssues(affectedIssueIds);
  }

  private async relink(activities: Activity[]) {
    const issueIdsBeforeUpdate = activities.map(activity => activity.issueId);

    for (let activity of activities) {
      await this.updateActivityLinks(activity);
    }

    const issueIdsAfterUpdate = activities.map(activity => activity.issueId);

    return [...issueIdsBeforeUpdate, ...issueIdsAfterUpdate];
  }

  private async updateActivityLinks(activity: Activity) {
    await this.processWeekLink(activity);
    await this.processIssueLink(activity);
  }

  private async processWeekLink(activity: Activity) {
    let week = await this.weekRepo.getById(activity.weekId);

    if (week) {
      return;
    }

    week = await this.weekRepo.getByDate(activity.date);

    if (!week) {
      week = new Week(activity.date);
      await this.weekRepo.save(week);
    }

    activity.weekId = week.id;
  }

  private async processIssueLink(activity: Activity): Promise<void> {
    if (!activity.isLinkedToIssue()) {
      return;
    }

    if (!activity.hasIssueKey() && activity.issueId) {
      return this.unlinkIssue(activity);
    }

    if (activity.hasIssueKey() && !activity.issueId) {
      return this.linkActivity(activity);
    }

    const linkedIssue = await this.issueRepository.getByKey(activity.getIssueKey() as string);

    if (!linkedIssue || linkedIssue.id !== activity.issueId) {
      return this.relinkIssue(activity);
    }
  }

  private async relinkIssue(activity: Activity): Promise<void> {
    await this.unlinkIssue(activity);
    await this.linkActivity(activity);
  }

  private async unlinkIssue(activity: Activity): Promise<void> {
    if (!activity.issueId) {
      throw new Error(`Cannot unlink activity ${activity.name}: Missing Issue ID!`);
    }

    delete activity.issueId;
  }

  private async linkActivity(activity: Activity): Promise<void> {
    const issueKey = activity.getIssueKey();

    if (!issueKey) {
      throw new Error(`Cannot link activity ${activity.name}: Missing Issue Key!`);
    }

    const issue = await this.getLinkedIssue(activity);

    activity.issueId = issue.id;
  }

  private async updateAffectedIssues(rawIssueIds: (string | undefined)[]): Promise<void> {
    const filteredIssueIds = rawIssueIds.filter(issueId => !!issueId) as string[];
    const uniqueIssueIds = Array.from(new Set(filteredIssueIds));
    const issues = await this.issueRepository.getByIds(uniqueIssueIds);

    for (let issue of issues) {
      const activities = await this.activitiesRepository.getByIssueId(issue.id);
      issue.activities = activities.length;
      issue.duration = this.activitiesService.calculateDuration(activities);
    }

    await this.issueRepository.bulkUpdate(issues);
  }

  private async getLinkedIssue(activity: Activity): Promise<Issue> {
    const issueKey = activity.getIssueKey();

    if (!issueKey) {
      throw new Error(`Cannot get linked issue, activity ${activity.name} is missing issue key!`);
    }

    let issue = await this.issueRepository.getByKey(issueKey);

    if (issue) {
      return issue;
    }

    return this.createMissingIssue(activity);
  }

  private createMissingIssue(activity: Activity): Promise<Issue> {
    if (!activity.isLinkedToIssue()) {
      throw new Error(`Activity ${activity.name} cannot be linked to issue!`);
    }

    const issue = new Issue({
      key: activity.getIssueKey() as string,
      name: activity.getShortName(),
    });

    return this.issueRepository.create(issue);
  }
}

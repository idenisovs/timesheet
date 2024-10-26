import { Injectable } from '@angular/core';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';
import { Activity, Issue } from '../dto';
import { IssueRepositoryService } from '../repository/issue-repository.service';

@Injectable({
  providedIn: 'root'
})
export class RemoveActivitiesWorkflowService {
  constructor(
    private activitiesRepository: ActivitiesRepositoryService,
    private issueRepository: IssueRepositoryService
  ) { }

  public async run(activityIds: string[]) {
    const removableActivities = await this.activitiesRepository.getByIds(activityIds);

    for (const activity of removableActivities) {
      await this.updateAffectedIssue(activity);
    }

    await this.activitiesRepository.remove(activityIds);
  }

  private async updateAffectedIssue(activity: Activity) {
    const issue = await this.getAffectedIssue(activity);

    if (!issue) {
      return;
    }

    issue.activities--;

    await this.issueRepository.update(issue);
  }

  private async getAffectedIssue(activity: Activity): Promise<Issue | null> {
    if (!activity.issueId && !activity.hasIssueKey()) {
      return null;
    }

    let issue = await this.issueRepository.getById(activity.issueId);

    if (issue) {
      return issue;
    }

    const issueKey = activity.getIssueKey() as string;

    if (issueKey) {
      issue = await this.issueRepository.getByKey(issueKey);
    }

    return issue;
  }
}

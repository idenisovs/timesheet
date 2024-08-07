import { Injectable } from '@angular/core';
import { Activity, Issue, Sheet } from '../../dto';
import { SheetStoreService } from '../../services/sheet-store.service';
import { IssueRepositoryService } from '../../repository/issue-repository.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

@Injectable({
  providedIn: 'root'
})
export class IssuePageService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private activityRepository: ActivitiesRepositoryService
  ) { }

  async remove(issue: Issue) {
    await this.removeActivities(issue);
    await this.removeIssue(issue);
  }

  private async removeActivities(issue: Issue) {
    const activities = await this.activityRepository.getByIssueKey(issue.key)
    const activityIds = activities.map(activity => activity.id);
    await this.activityRepository.remove(activityIds);
  }

  private async removeIssue(issue: Issue) {
    await this.issueRepository.remove(issue);
  }
}

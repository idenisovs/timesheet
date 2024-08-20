import { Injectable } from '@angular/core';

import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { Activity, Issue, Week } from '../../../dto';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { IssueOverview } from './IssueOverview';
import { ActivitiesService } from '../../../services/activities.service';
import parseDuration from 'parse-duration';
import { WeeklyOverview } from './WeeklyOverview';

@Injectable({
  providedIn: 'root'
})
export class WeeklyOverviewModalService {

  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private issueRepository: IssueRepositoryService,
    private activitiesService: ActivitiesService,
  ) {
  }

  async run(week: Week): Promise<WeeklyOverview> {
    const activities = await this.activityRepository.getByWeek(week);
    const totalDuration = this.activitiesService.calculateDuration(activities);
    const totalDurationMs = parseDuration(totalDuration) ?? 0;
    const issueKeys = this.getIssueKeys(activities);
    let issues = await this.issueRepository.getAllByKeys(issueKeys);

    issues = issues.sort(this.sortIssues)

    const issueOverviewList: IssueOverview[] = []

    for (let issue of issues) {
      const issueActivityGroup = activities.filter((item) => item.getIssueKey() === issue.key);
      const issueWeeklyDuration = this.activitiesService.calculateDuration(issueActivityGroup);
      const issueWeeklyDurationMs = parseDuration(issueWeeklyDuration) ?? 0;

      issueOverviewList.push({
        issue,
        activities: issueActivityGroup,
        duration: this.activitiesService.calculateDuration(issueActivityGroup),
        durationRatio: issueWeeklyDurationMs / totalDurationMs
      })
    }

    return {
      issueOverviewList: issueOverviewList,
      duration: totalDuration,
      activities: activities.length
    }
  }

  getIssueKeys(activities: Activity[]): string[] {
    const issueKeys = activities.map((activity: Activity) => activity.getIssueKey()).filter(key => !!key) as string[];
    const uniqueIssueKeys = new Set(issueKeys);
    return Array.from(uniqueIssueKeys);
  }

  sortIssues(issue1: Issue, issue2: Issue) {
    if (issue1.key > issue2.key) {
      return -1;
    }

    if (issue1.key < issue2.key) {
      return 1;
    }

    return 0;
  }
}

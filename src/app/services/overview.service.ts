import { Injectable } from '@angular/core';
import { IssueRepositoryService } from '../repository/issue-repository.service';
import { ActivitiesService } from './activities.service';
import { Activity, ActivityOverview, Issue, IssueOverview, Overview } from '../dto';
import parseDuration from 'parse-duration';
import { calculateTotalDuration } from '../utils';
import { duration } from 'yet-another-duration';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private activitiesService: ActivitiesService,
  ) { }

  async getOverview(activities: Activity[], interval: number): Promise<Overview> {
    const totalDuration = this.activitiesService.calculateDurationMs(activities);
    const issues = await this.getActivityIssues(activities);
    const issueOverviewList: IssueOverview[] = this.getIssueOverviewList(issues, activities, totalDuration);

    const miscellaneousActivitiesIssue: IssueOverview = this.getMiscellaneousActivitiesIssue(activities, totalDuration);

    if (miscellaneousActivitiesIssue.activities.length) {
      issueOverviewList.push(miscellaneousActivitiesIssue);
    }

    return {
      issueOverviewList: issueOverviewList,
      duration: this.getDurationStr(totalDuration),
      durationRatio: totalDuration / interval,
      activities: activities.length,
    };
  }

  private async getActivityIssues(activities: Activity[]): Promise<Issue[]> {
    const issueKeys = this.getIssueKeys(activities);
    const issues = await this.issueRepository.getAllByKeys(issueKeys);
    return issues.sort(this.sortIssuesByKey)
  }

  private getIssueKeys(activities: Activity[]): string[] {
    const issueKeys = activities.map((activity: Activity) => activity.getIssueKey()).filter(key => !!key) as string[];
    const uniqueIssueKeys = new Set(issueKeys);
    return Array.from(uniqueIssueKeys);
  }

  private sortIssuesByKey(issue1: Issue, issue2: Issue) {
    const [projectPrefixA, issueIdA] = issue1.key.split('-');
    const [projectPrefixB, issueIdB] = issue2.key.split('-');

    if (projectPrefixA < projectPrefixB) return -1;
    if (projectPrefixA > projectPrefixB) return 1;

    return Number(issueIdB) - Number(issueIdA);
  }

  private getIssueOverviewList(issues: Issue[], activities: Activity[], totalDuration: number) {
    const issueOverviewList: IssueOverview[] = [];

    for (let issue of issues) {
      const issueActivityGroup = activities.filter((item) => item.getIssueKey() === issue.key);
      const issueWeeklyDuration = this.activitiesService.calculateDuration(issueActivityGroup);
      const issueWeeklyDurationMs = parseDuration(issueWeeklyDuration) ?? 0;
      const issueActivitiesOverview = this.getActivityOverview(issueActivityGroup, totalDuration);

      issueOverviewList.push({
        issue,
        activities: issueActivityGroup,
        activityOverview: issueActivitiesOverview,
        duration: this.activitiesService.calculateDuration(issueActivityGroup),
        durationRatio: issueWeeklyDurationMs / totalDuration,
      });
    }

    return issueOverviewList;
  }

  private getMiscellaneousActivitiesIssue(activities: Activity[], totalDuration: number): IssueOverview {
    const miscellaneousActivities = activities.filter((activity: Activity) => !activity.hasIssueKey());
    const miscellaneousActivitiesOverview = this.getActivityOverview(miscellaneousActivities, totalDuration);
    const miscellaneousActivityDuration = this.activitiesService.calculateDuration(miscellaneousActivities);
    const miscellaneousActivityDurationMs = parseDuration(miscellaneousActivityDuration) ?? 0;

    const issue = new Issue({ name: 'Miscellaneous activities' });
    issue.activities = miscellaneousActivities.length;
    issue.duration = miscellaneousActivityDuration;

    return {
      issue,
      activities: miscellaneousActivities,
      activityOverview: miscellaneousActivitiesOverview,
      duration: miscellaneousActivityDuration,
      durationRatio: miscellaneousActivityDurationMs / totalDuration
    };
  }

  private getActivityOverview(activities: Activity[], totalDuration: number): ActivityOverview[] {
    const activityGroups = this.groupActivitiesByName(activities);

    const activityOverview: ActivityOverview[] = [];

    for (const [, activityGroup] of activityGroups.entries()) {
      const durationMs = calculateTotalDuration(activityGroup);

      activityOverview.push({
        name: activityGroup[0].getShortName(),
        activities: activityGroup,
        duration: this.getDurationStr(durationMs),
        durationRatio: durationMs / totalDuration,
      });
    }

    return activityOverview;
  }

  private groupActivitiesByName(activities: Activity[]): Map<string, Activity[]> {
    const activityGroups = new Map<string, Activity[]>();

    for (let activity of activities) {
      if (activityGroups.has(activity.name)) {
        activityGroups.get(activity.name)?.push(activity);
      } else {
        activityGroups.set(activity.name, [activity]);
      }
    }

    return activityGroups;
  }

  private getDurationStr(durationMs: number) {
    const result = duration(durationMs, {
      units: {
        min: 'minutes',
        max: 'hours'
      }
    }).toString();

    return result.length ? result : '0h';
  }
}

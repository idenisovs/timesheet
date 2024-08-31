import { Injectable } from '@angular/core';
import parseDuration from 'parse-duration';
import { duration } from 'yet-another-duration';

import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { ActivitiesService } from '../../../services/activities.service';
import { calculateTotalDuration } from '../../../utils';
import { Activity, Issue, Week } from '../../../dto';
import { IssueOverview, WeeklyOverview, ActivityOverview } from './types';
import { WORK_WEEK } from '../../../constants';

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
    const totalDurationRatio = totalDurationMs / WORK_WEEK;
    const issueKeys = this.getIssueKeys(activities);
    const issues = await this.issueRepository.getAllByKeys(issueKeys);
    const sortedIssues = issues.sort(this.sortIssues);

    const issueOverviewList: IssueOverview[] = this.getIssueOverviewList(sortedIssues, activities, totalDurationMs);

    const miscellaneousActivitiesIssue: IssueOverview = this.getMiscellaneousActivitiesIssue(activities, totalDurationMs);
    issueOverviewList.push(miscellaneousActivitiesIssue);

    const miscellaneousActivities = activities.filter((activity: Activity) => !activity.hasIssueKey());
    const generalActivitiesList = this.getActivityOverview(miscellaneousActivities, totalDurationMs);

    return {
      issueOverviewList: issueOverviewList,
      generalActivityOverviewList: generalActivitiesList,
      duration: totalDuration,
      activities: activities.length,
      workWeekRatio: totalDurationRatio,
    }
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

  private getIssueKeys(activities: Activity[]): string[] {
    const issueKeys = activities.map((activity: Activity) => activity.getIssueKey()).filter(key => !!key) as string[];
    const uniqueIssueKeys = new Set(issueKeys);
    return Array.from(uniqueIssueKeys);
  }

  private sortIssues(issue1: Issue, issue2: Issue) {
    const [projectPrefixA, issueIdA] = issue1.key.split('-');
    const [projectPrefixB, issueIdB] = issue2.key.split('-');

    if (projectPrefixA < projectPrefixB) return -1;
    if (projectPrefixA > projectPrefixB) return 1;

    return Number(issueIdB) - Number(issueIdA);
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
    return duration(durationMs, {
      units: {
        min: 'minutes',
        max: 'hours'
      }
    }).toString();
  }
}

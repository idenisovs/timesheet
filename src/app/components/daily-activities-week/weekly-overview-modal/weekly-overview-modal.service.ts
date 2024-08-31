import { Injectable } from '@angular/core';
import parseDuration from 'parse-duration';
import { duration } from 'yet-another-duration';

import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { ActivitiesService } from '../../../services/activities.service';
import { calculateTotalDuration } from '../../../utils';
import { Activity, Issue, Week } from '../../../dto';
import { IssueOverview, WeeklyOverview, GeneralActivityOverview } from './types';
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
    const generalActivitiesList = this.getGeneralActivityList(activities, totalDurationMs);

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

      issueOverviewList.push({
        issue,
        activities: issueActivityGroup,
        duration: this.activitiesService.calculateDuration(issueActivityGroup),
        durationRatio: issueWeeklyDurationMs / totalDuration,
      });
    }

    return issueOverviewList;
  }

  getIssueKeys(activities: Activity[]): string[] {
    const issueKeys = activities.map((activity: Activity) => activity.getIssueKey()).filter(key => !!key) as string[];
    const uniqueIssueKeys = new Set(issueKeys);
    return Array.from(uniqueIssueKeys);
  }

  sortIssues(issue1: Issue, issue2: Issue) {
    const [projectPrefixA, issueIdA] = issue1.key.split('-');
    const [projectPrefixB, issueIdB] = issue2.key.split('-');

    if (projectPrefixA < projectPrefixB) return -1;
    if (projectPrefixA > projectPrefixB) return 1;

    return Number(issueIdB) - Number(issueIdA);
  }

  getGeneralActivityList(activities: Activity[], totalDuration: number): GeneralActivityOverview[] {
    const generalActivities = activities.filter((activity: Activity) => !activity.hasIssueKey());
    const generalActivityGroups = this.groupActivitiesByName(generalActivities);

    const generalActivityOverview: GeneralActivityOverview[] = [];

    for (const [name, activityGroup] of generalActivityGroups.entries()) {
      const durationMs = calculateTotalDuration(activityGroup);

      generalActivityOverview.push({
        name,
        activities: activityGroup,
        duration: this.getDurationStr(durationMs),
        durationRatio: durationMs / totalDuration,
      });
    }

    return generalActivityOverview;
  }

  groupActivitiesByName(activities: Activity[]): Map<string, Activity[]> {
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

  getDurationStr(durationMs: number) {
    return duration(durationMs, {
      units: {
        min: 'minutes',
        max: 'hours'
      }
    }).toString();
  }
}

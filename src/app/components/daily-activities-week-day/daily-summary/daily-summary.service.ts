import { Injectable } from '@angular/core';
import parseDuration from 'parse-duration';
import { duration } from 'yet-another-duration';

import { Activity } from '../../../dto';
import { DailySummary, DailySummaryActivity, DailySummaryIssue } from './DailySummary';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { ActivitiesService } from '../../../services/activities.service';


@Injectable({
  providedIn: 'root'
})
export class DailySummaryService {

  constructor(
    private issueRepository: IssueRepositoryService,
    private activitiesService: ActivitiesService,
  ) { }

  async buildSummary(activities: Activity[]): Promise<DailySummary> {
    const summary = new DailySummary();

    summary.issues = await this.makeIssueList(activities);
    summary.duration = this.recalculateDuration(summary.issues);

    return summary;
  }

  async makeIssueList(activities: Activity[]): Promise<DailySummaryIssue[]> {
    const activityGroups: Map<string, Activity[]> = this.groupActivities(activities);

    const result: DailySummaryIssue[] = [];

    for (let [issueKey, issueActivities] of activityGroups.entries()) {
      const issue: DailySummaryIssue = await this.makeIssue(issueKey, issueActivities);
      result.push(issue);
    }

    return result;
  }

  groupActivities(activities: Activity[]) {
    const activityGroups = new Map<string, Activity[]>();

    for (let activity of activities) {
      const key = this.getKeyForActivity(activity);

      const activityGroup = activityGroups.get(key);

      if (activityGroup) {
        activityGroup.push(activity);
      } else {
        activityGroups.set(key, [activity]);
      }
    }

    return activityGroups;
  }

  getKeyForActivity(activity: Activity): string {
    const key = activity.getIssueKey();

    if (key) {
      return key;
    } else {
      return activity.name;
    }
  }

  async makeIssue(issueKey: string, issueActivities: Activity[]): Promise<DailySummaryIssue> {
    return {
      key: issueKey,
      name: await this.getIssueName(issueKey, issueActivities),
      activities: issueActivities.map(this.makeDailySummaryActivity),
      duration: this.activitiesService.calculateDuration(issueActivities)
    };
  }

  async getIssueName(issueKey: string, issueActivities: Activity[]): Promise<string> {
    const issue = await this.issueRepository.getByKey(issueKey);

    if (issue && issue.name) {
      return `${issue.key}: ${issue.name}`;
    }

    const firstActivity = issueActivities[0];

    return firstActivity.name;
  }

  makeDailySummaryActivity(activity: Activity): DailySummaryActivity {
    return {
      name: activity.getShortName(),
      duration: activity.duration
    };
  }

  recalculateDuration(dailySummaryIssues: DailySummaryIssue[]) {
    const durationStrings = dailySummaryIssues.map((issue) => issue.duration);
    const durationMs: number[] = durationStrings.map((duration) => parseDuration(duration) ?? 0);

    const totalDuration = durationMs.reduce((result, duration) => {
      return result + duration;
    }, 0);

    return duration(totalDuration, {
      units: {
        min: 'minutes'
      }
    }).toString();
  }
}

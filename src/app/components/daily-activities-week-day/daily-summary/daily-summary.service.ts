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

  squashIssueActivities(activities: DailySummaryActivity[]): DailySummaryActivity[] {
    const result = [...activities];

    for (let idx = 0; idx < result.length; idx++) {
      const activity = result[idx];

      for (let jdx = idx + 1; jdx < result.length; jdx++) {
        const nextActivity = result[jdx];

        if (activity.name === nextActivity.name) {
          activity.duration = this.sum([activity.duration, nextActivity.duration]);
          result.splice(jdx, 1);
          jdx--;
        }
      }
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
    const activities: DailySummaryActivity[] = issueActivities.map(this.makeDailySummaryActivity);
    const squashedIssueActivities = this.squashIssueActivities(activities);

    return {
      key: issueKey,
      name: await this.getIssueName(issueKey, issueActivities),
      activities: squashedIssueActivities,
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

  recalculateDuration(dailySummaryIssues: DailySummaryIssue[]): string {
    const durationStrings: string[] = dailySummaryIssues.map<string>((issue: DailySummaryIssue) => issue.duration);

    return this.sum(durationStrings);
  }

  sum(durationStrings: string[]): string {
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

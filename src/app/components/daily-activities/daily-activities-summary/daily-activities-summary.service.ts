import { Injectable } from '@angular/core';
import { DailyActivitiesSummary } from './DailyActivitiesSummary';
import { Activity, Sheet } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';
import { Issue } from '../../../services/Issue';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesSummaryService {
  constructor(private activitiesService: ActivitiesService) { }

  public build(sheet: Sheet): DailyActivitiesSummary {
    const result: DailyActivitiesSummary = {
      date: new Date(sheet.date),
      issues: [],
      duration: '0m',
    };

    const activeActivities = this.activitiesService.filterActive(sheet.activities);

    result.issues = this.makeIssueList(activeActivities);
    result.duration = this.activitiesService.calculateDuration(activeActivities);

    return result;
  }

  private makeIssueList(activities: Activity[]): Issue[] {
    const mergedActivities: Activity[] = this.mergeSameActivities(activities);

    const issues: Issue[] = this.buildIssueList(mergedActivities);

    this.processIssueList(issues);

    this.sortIssueList(issues);

    return issues;
  }

  private mergeSameActivities(activities: Activity[]): Activity[] {
    return activities.reduce((mergedActivities: Activity[], activity: Activity) => {
      const existingActivity = mergedActivities.find((item) => item.name === activity.name);

      if (existingActivity) {
        existingActivity.duration = this.activitiesService.calculateDuration([ existingActivity, activity ]);
      } else {
        mergedActivities.push({ ...activity });
      }

      return mergedActivities;
    }, []);
  }

  private buildIssueList(activities: Activity[]): Issue[] {
    return activities.reduce<Issue[]>((issues: Issue[], activity: Activity) => {
      const issueKey = this.activitiesService.getIssueKey(activity.name);

      let issue = issues.find((item) => item.name === issueKey);

      if (!issue) {
        issue = new Issue(issueKey);
        issues.push(issue);
      }

      issue.activities.push({
        ...activity,
        name: this.activitiesService.getShortName(activity.name)
      });

      return issues;
    }, []);
  }

  private processIssueList(issues: Issue[]) {
    issues.forEach((issue: Issue) => {
      issue.duration = this.activitiesService.calculateDuration(issue.activities);

      if (issue.activities.length > 1) {
        return;
      }

      const activity = issue.activities[0];

      if (issue.name === activity.name) {
        return;
      }

      issue.name = `${issue.name}: ${activity.name}`;
    });
  }

  private sortIssueList(issues: Issue[]) {
    issues.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }
}

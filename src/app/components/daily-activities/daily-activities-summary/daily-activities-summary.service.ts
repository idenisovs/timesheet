import { Injectable } from '@angular/core';
import { DailyActivitiesSummary } from './DailyActivitiesSummary';
import { Activity, Sheet } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';
import { DailyActivitiesSummaryIssue } from './DailyActivitiesSummaryIssue';
import { Issue as IssueRecord } from '../../../dto';
import { SheetStoreService } from '../../../services/sheet-store.service';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesSummaryService {
  constructor(
    private activitiesService: ActivitiesService,
    private sheetStore: SheetStoreService
  ) { }

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

  private makeIssueList(activities: Activity[]): DailyActivitiesSummaryIssue[] {
    const mergedActivities: Activity[] = this.mergeSameActivities(activities);

    const issues: DailyActivitiesSummaryIssue[] = this.buildIssueList(mergedActivities);

    this.processIssueList(issues);

    this.sortIssueList(issues);

    this.setIssueNames(issues);

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

  private buildIssueList(activities: Activity[]): DailyActivitiesSummaryIssue[] {
    return activities.reduce<DailyActivitiesSummaryIssue[]>((issues: DailyActivitiesSummaryIssue[], activity: Activity) => {
      const issueKey = this.activitiesService.getIssueKey(activity.name);

      let issue = issues.find((item) => item.name === issueKey);

      if (!issue) {
        issue = new DailyActivitiesSummaryIssue(issueKey);
        issues.push(issue);
      }

      issue.activities.push({
        ...activity,
        name: this.activitiesService.getShortName(activity.name)
      });

      return issues;
    }, []);
  }

  private processIssueList(issues: DailyActivitiesSummaryIssue[]) {
    issues.forEach((issue: DailyActivitiesSummaryIssue) => {
      issue.duration = this.activitiesService.calculateDuration(issue.activities);
    });
  }

  private sortIssueList(issues: DailyActivitiesSummaryIssue[]) {
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

  private setIssueNames(issues: DailyActivitiesSummaryIssue[]) {
    issues.forEach((issue: DailyActivitiesSummaryIssue) => {
      const issueKey = this.activitiesService.getIssueKey(issue.name);

      this.findIssueRecord(issueKey).then((existingIssueRecord) => {
        if (existingIssueRecord) {
          issue.name = `${existingIssueRecord.key}: ${existingIssueRecord.name}`;
        }
      });
    });
  }

  private async findIssueRecord(issueKey: string): Promise<IssueRecord | undefined> {
    return this.sheetStore.Instance.issues.where('key').equals(issueKey).first();
  }
}

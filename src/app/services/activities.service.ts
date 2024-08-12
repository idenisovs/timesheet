import { Injectable } from '@angular/core';
import { duration } from 'yet-another-duration';
import { Activity, ActivitySummary } from '../dto';
import { calculateTotalDuration } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor() { }

  public calculateDuration(activities: Activity[]): string {
    return duration(calculateTotalDuration(activities), {
      units: {
        min: 'minutes',
        max: 'hours'
      }
    }).toString();
  }

  public getIssueKeys(activities: Activity[]): string[] {
    const issueKeys: string[] = activities
      .map(activity => activity.getIssueKey())
      .filter(issueKey => issueKey !== null) as string[];

    const uniqueIssueKeys = new Set(issueKeys);

    return Array.from(uniqueIssueKeys);
  }

  public getActivitySummary(activities: Activity[]): ActivitySummary {
    const summary = new ActivitySummary();

    summary.activities = activities.length;
    summary.duration = this.calculateDuration(activities);

    return summary;
  }
}

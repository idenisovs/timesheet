import { Injectable } from '@angular/core';
import { duration } from 'yet-another-duration';
import { Activity, ActivitySummary } from '../dto';
import parseDuration from 'parse-duration';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private static readonly DURATION_CONFIG = {
    units: {
      min: 'minutes',
      max: 'hours'
    }
  };

  constructor() { }

  public getActivityDurationMs(activity: Activity): number {
    const result = parseDuration(activity.duration);

    return result ?? 0;
  }

  public calculateDurationMs(activities: Activity[]): number {
    return activities.reduce<number>((result: number, activity: Activity) => {
      const activityDuration = this.getActivityDurationMs(activity);

      return result + activityDuration;
    }, 0);
  }

  public calculateDuration(activities: Activity[]): string {
    const durationMs = this.calculateDurationMs(activities);

    return duration(durationMs, ActivitiesService.DURATION_CONFIG).toString();
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

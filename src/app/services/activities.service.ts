import { Injectable } from '@angular/core';
import { duration } from 'yet-another-duration';
import { Activity } from '../dto';
import { calculateTotalDuration } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor() { }

  public calculateDuration(activities: Activity[]): string {
    return duration(calculateTotalDuration(activities), {
      units: {
        min: 'minutes'
      }
    }).toString();
  }

  public filterActive(activities: Activity[]): Activity[] {
    return activities.filter((activity) => !!activity.duration)
  }

  public getShortName(activityName: string): string {
    return activityName.split(':').pop() ?? 'n/a';
  }

  public getIssueKeys(activities: Activity[]): string[] {
    const issueKeys = activities.reduce<Set<string>>((result: Set<string>, activity: Activity) => {
      const issueKey = this.getIssueKey(activity.name);
      result.add(issueKey);
      return result;
    }, new Set<string>());

    return Array.from(issueKeys);
  }

  public getIssueKey(activityName: string): string {
    return activityName.split(':').shift() ?? 'n/a';
  }
}

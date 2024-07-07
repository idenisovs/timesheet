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
    const issueKeys: string[] = activities
      .map(activity => this.getIssueKey(activity.name))
      .filter(issueKey => issueKey !== null) as string[];

    const uniqueIssueKeys = new Set(issueKeys);

    return Array.from(uniqueIssueKeys);
  }

  public getIssueKey(activityName: string): string | null {
    if (activityName.match(/\w+-\d+:/)) {
      return activityName.split(':').shift() as string;
    } else {
      return null;
    }
  }
}

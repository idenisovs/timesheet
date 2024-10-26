import { Injectable } from '@angular/core';
import { Activity, ActivitySummary } from '../dto';
import { DurationService } from './duration.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  constructor(
    private durationService: DurationService
  ) { }

  public calculateDurationMs(activities: Activity[]): number {
    return activities.reduce<number>((result: number, activity: Activity) => {
      return result + this.durationService.toMs(activity.duration);
    }, 0);
  }

  public calculateDuration(activities: Activity[]): string {
    const durationValues = activities.map(activity => activity.duration);
    return this.durationService.sum(durationValues);
  }

  public getActivitySummary(activities: Activity[]): ActivitySummary {
    const summary = new ActivitySummary();

    summary.activities = activities.length;
    summary.duration = this.calculateDuration(activities);

    return summary;
  }
}

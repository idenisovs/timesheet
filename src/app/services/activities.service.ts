import { inject, Injectable, OnDestroy } from '@angular/core';

import { Activity, ActivitySummary, Day } from '../dto';
import { DurationService } from './duration.service';
import { ScreenService } from './screen.service';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService implements OnDestroy {
  private durationService = inject(DurationService);
  private screenService = inject(ScreenService);
  private activityRepository = inject(ActivitiesRepositoryService);

  private isMobile = false;

  private isMobileSub = this.screenService.isMobile$.subscribe((value: boolean) => {
    this.isMobile = value;
  });

  public ngOnDestroy() {
    this.isMobileSub.unsubscribe();
  }

  public async loadDailyActivities(day: Day): Promise<Activity[]> {
    const order = this.isMobile ? 'desc' : 'asc';
    return this.activityRepository.getByDay(day, order);
  }

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

  public findOverlappingActivities(activities: Activity[], target: Activity): Activity[] {
    return activities.filter(activity => activity.overlaps(target));
  }
}

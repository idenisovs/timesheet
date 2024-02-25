import { Injectable } from '@angular/core';
import { duration } from 'yet-another-duration';
import { Activity } from '../../dto';
import { calculateTotalDuration } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesService {
  worker!: Worker;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./daily-activities.worker', import.meta.url));
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  public getTotalDuration(activities: Activity[]): string {
    const totalDuration = calculateTotalDuration(activities);

    return duration(totalDuration || 0, {
      units: {
        min: 'minutes'
      }
    }).toString();
  }

  public triggerTaskUpdate() {
    this.worker.postMessage('updateTasks')
  }
}

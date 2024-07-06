import { Injectable } from '@angular/core';
import { duration } from 'yet-another-duration';
import { Activity } from '../../dto';
import { calculateTotalDuration } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesService {
  constructor() {}

  public getTotalDuration(activities: Activity[]): string {
    const totalDuration = calculateTotalDuration(activities);

    const result = duration(totalDuration || 0, {
      units: {
        min: 'minutes'
      }
    }).toString();

    return result ? result : '0h';
  }
}

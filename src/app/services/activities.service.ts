import { Injectable } from '@angular/core';
import { Activity } from '../dto';
import { Task } from './Task';
import { calculateTotalDuration } from '../utils';
import { duration } from 'yet-another-duration';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor() { }

  public groupByHeader(activities: Activity[]) {
    const tasks = activities.reduce((result: Map<string, Task>, activity: Activity) => {
      const taskNr = activity.name.split(':').shift() as string;

      if (result.has(taskNr)) {
        result.get(taskNr)?.activities.push(activity);
      } else {
        result.set(taskNr, { activities: [activity], duration: '0' })
      }

      return result;
    }, new Map<string, Task>());

    tasks.forEach((task) => {
      task.duration = this.calculateDuration(task.activities);
    });

    return tasks;
  }

  public calculateDuration(activities: Activity[]): string {
    return duration(calculateTotalDuration(activities), {
      units: {
        min: 'minutes'
      }
    }).toString();
  }
}

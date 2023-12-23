import { Injectable } from '@angular/core';
import { DailyActivitiesSummary } from './DailyActivitiesSummary';
import { Activity, Sheet } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';
import { Task } from '../../../services/Task';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesSummaryService {
  constructor(private activitiesService: ActivitiesService) { }

  public build(sheet: Sheet): DailyActivitiesSummary {
    const result: DailyActivitiesSummary = {
      date: new Date(sheet.date),
      tasks: [],
      duration: '0m',
    };

    const activeActivities = this.activitiesService.filterActive(sheet.activities);

    result.tasks = this.makeTaskList(activeActivities);
    result.duration = this.activitiesService.calculateDuration(activeActivities);

    return result;
  }

  private makeTaskList(activities: Activity[]): Task[] {
    const tasks: Task[] = [];

    for (let activity of activities) {
      const taskNr = this.activitiesService.getTaskNumber(activity.name);

      let task = tasks.find((item) => item.name === taskNr);

      if (!task) {
        task = new Task(taskNr);
        tasks.push(task);
      }

      task.activities.push({
        ...activity,
        name: this.activitiesService.getShortName(activity.name)
      });
    }

    tasks.forEach((task) => {
      task.duration = this.activitiesService.calculateDuration(task.activities);

      if (task.activities.length > 1) {
        return;
      }

      const activity = task.activities[0];

      if (task.name === activity.name) {
        return;
      }

      task.name = `${task.name}: ${activity.name}`;
    });

    return tasks;
  }
}

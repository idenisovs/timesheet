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
    const mergedActivities: Activity[] = this.mergeSameActivities(activities);

    const tasks: Task[] = this.buildTasks(mergedActivities);

    this.processTaskList(tasks);

    this.sortTaskList(tasks);

    return tasks;
  }

  private mergeSameActivities(activities: Activity[]): Activity[] {
    return activities.reduce((mergedActivities: Activity[], activity: Activity) => {
      const existingActivity = mergedActivities.find((item) => item.name === activity.name);

      if (existingActivity) {
        existingActivity.duration = this.activitiesService.calculateDuration([ existingActivity, activity ]);
      } else {
        mergedActivities.push({ ...activity });
      }

      return mergedActivities;
    }, []);
  }

  private buildTasks(activities: Activity[]): Task[] {
    return activities.reduce<Task[]>((tasks: Task[], activity: Activity) => {
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

      return tasks;
    }, []);
  }

  private processTaskList(tasks: Task[]) {
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
  }

  private sortTaskList(tasks: Task[]) {
    tasks.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }
}

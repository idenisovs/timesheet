import { Activity, CreateTask, Sheet } from '../dto';
import { sumDuration } from './date';

export function getTasks(sheets: Sheet[]): CreateTask[] {
  const tasks = new Map<string, CreateTask>();

  sheets.forEach((timesheet) => {
    timesheet.activities.forEach((activity) => {
      upsertTask(tasks, activity, new Date(timesheet.date));
    });
  });

  return Array.from(tasks.values());
}

function upsertTask(tasks: Map<string, CreateTask>, activity: Activity, sheetDate: Date) {
  if (!activity.name.match(/\w+-\d+/)) {
    return;
  }

  const taskKey = activity.name.split(':')[0];

  if (tasks.has(taskKey)) {
    updateTask(tasks, taskKey, activity, sheetDate);
  } else {
    createTask(tasks, taskKey, activity, sheetDate);
  }
}

function createTask(tasks: Map<string, CreateTask>, taskKey: string, activity: Activity, sheetDate: Date) {
  tasks.set(taskKey, {
    key: taskKey,
    name: '',
    activities: 1,
    duration: activity.duration,
    createdAt: sheetDate
  });
}

function updateTask(tasks: Map<string, CreateTask>, taskKey: string, activity: Activity, sheetDate: Date) {
  const task = tasks.get(taskKey) as CreateTask;

  task.activities++;
  task.duration = sumDuration(task.duration, activity.duration);

  if (task.createdAt > sheetDate) {
    task.createdAt = sheetDate;
  }
}

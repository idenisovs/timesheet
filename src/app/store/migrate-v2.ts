import SheetStore from './SheetStore';
import { Transaction } from 'dexie';
import { Activity, CreateTask, Sheet } from '../dto';
import { sumDuration } from '../utils';

export default async function migrateV2(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const tasks = getTasks(sheets);
  return trans.table('tasks').bulkAdd(tasks);
}

function getTasks(sheets: Sheet[]): CreateTask[] {
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

  const taskNr = activity.name.split(':')[0];

  if (tasks.has(taskNr)) {
    updateTask(tasks, taskNr, activity, sheetDate);
  } else {
    createTask(tasks, taskNr, activity, sheetDate);
  }
}

function createTask(tasks: Map<string, CreateTask>, taskNr: string, activity: Activity, sheetDate: Date) {
  tasks.set(taskNr, {
    key: taskNr,
    name: '',
    activities: 1,
    duration: activity.duration,
    createdAt: sheetDate
  });
}

function updateTask(tasks: Map<string, CreateTask>, taskNr: string, activity: Activity, sheetDate: Date) {
  const task = tasks.get(taskNr) as CreateTask;

  task.activities++;
  task.duration = sumDuration(task.duration, activity.duration);

  if (task.createdAt > sheetDate) {
    task.createdAt = sheetDate;
  }
}



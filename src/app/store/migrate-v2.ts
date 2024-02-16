import SheetStore from './SheetStore';
import { Transaction } from 'dexie';
import { Activity, Sheet, Task } from '../dto';

export default async function migrateV2(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const tasks = getTasks(sheets);
  return trans.table('tasks').bulkAdd(tasks)
}

function getTasks(sheets: Sheet[]): Omit<Task, 'id'>[] {
  const tasks = new Map<string, Omit<Task, 'id'>>();

  sheets.forEach((timesheet) => {
    timesheet.activities.forEach((activity) => {
      upsertTask(tasks, activity);
    });
  });

  return Array.from(tasks.values());
}

function upsertTask(tasks: Map<string, Omit<Task, 'id'>>, activity: Activity) {
  if (!activity.name.match(/\w+-\d+/)) {
    return;
  }

  const taskNr = activity.name.split(':')[0];

  if (tasks.has(taskNr)) {
    updateTask(tasks, activity);
  } else {
    createTask(tasks, activity);
  }
}

function createTask(tasks: Map<string, Omit<Task, 'id'>>, activity: Activity) {}

function updateTask(tasks: Map<string, Omit<Task, 'id'>>, activity: Activity) {}



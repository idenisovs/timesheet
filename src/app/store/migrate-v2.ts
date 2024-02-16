import SheetStore from './SheetStore';
import { Transaction } from 'dexie';
import { Sheet } from '../dto';

export default async function migrateV2(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const taskNrs = getTaskNrs(sheets);

  const tasks = Array.from(taskNrs).map((taskNr) => ({
    name: taskNr
  }));

  console.log(tasks);

  return trans.table('tasks').bulkAdd(tasks)
}

function getTaskNrs(sheets: Sheet[]): string[] {
  const taskNrs = new Set<string>();

  sheets.forEach((timesheet) => {
    timesheet.activities.forEach((activity) => {
      if (!activity.name.match(/\w+-\d+/)) {
        return;
      }

      const taskNr = activity.name.split(':')[0];

      taskNrs.add(taskNr);
    });
  });

  return Array.from(taskNrs);
}

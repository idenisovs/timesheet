import Dexie, { Transaction } from 'dexie';
import { Sheet, Task } from '../dto';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  tasks: Dexie.Table<Task, number>;

  constructor() {
    super('timesheet');

    this.version(2.2).stores({
      sheet: '++id,date,activities',
      tasks: '++id,&name'
    }).upgrade(this.migrateV2.bind(this));

    this.sheet = this.table('sheet');
    this.tasks = this.table('tasks');
  }

  async migrateV2(trans: Transaction) {
    const sheets = await this.sheet.orderBy('date').reverse().toArray();
    const taskNrs = this.getTaskNrs(sheets);

    const tasks = Array.from(taskNrs).map((taskNr) => ({
      name: taskNr
    }));

    return trans.table('tasks').bulkAdd(tasks)
  }

  private getTaskNrs(sheets: Sheet[]): string[] {
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
}

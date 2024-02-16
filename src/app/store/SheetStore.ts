import Dexie, { Transaction } from 'dexie';
import { Sheet, Task } from '../dto';
import migrateV2 from './migrate-v2';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  tasks: Dexie.Table<Task, number>;

  constructor() {
    super('timesheet');

    this.version(2.3).stores({
      sheet: '++id,date,activities',
      tasks: '++id,&name'
    }).upgrade((trans: Transaction) => migrateV2(this, trans));

    this.sheet = this.table('sheet');
    this.tasks = this.table('tasks');
  }
}

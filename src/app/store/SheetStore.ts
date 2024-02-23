import Dexie, { Transaction } from 'dexie';
import { Sheet, Task } from '../dto';
import migrateV2 from './migrate-v2';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  tasks: Dexie.Table<Task, number>;

  constructor() {
    super('timesheet');

    this.version(1).stores({
      sheet: '++id,date,activities'
    });

    this.version(3.3).stores({
      tasks: '++id,&key,name'
    }).upgrade((trans: Transaction) => migrateV2(this, trans));

    this.sheet = this.table('sheet');
    this.tasks = this.table('tasks');
  }
}

import Dexie from 'dexie';
import { Sheet, Task } from '../dto';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  tasks: Dexie.Table<Task, number>;

  constructor() {
    super('timesheet');

    this.version(2).stores({
      sheet: '++id,date,activities',
      tasks: '++id,&name'
    });

    this.sheet = this.table('sheet');
    this.tasks = this.table('tasks');
  }
}

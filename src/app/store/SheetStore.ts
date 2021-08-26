import Dexie from 'dexie';
import Sheet from '../dto/Sheet';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;

  constructor() {
    super('timesheet');

    this.version(1).stores({
      sheet: '++id,date,activities'
    });

    this.sheet = this.table('sheet');
  }
}

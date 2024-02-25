import Dexie, { Transaction } from 'dexie';
import { Sheet, Issue } from '../dto';
import migrateV2 from './migrate-v2';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  issues: Dexie.Table<Issue, number>;

  constructor() {
    super('timesheet');

    this.version(1).stores({
      sheet: '++id,date,activities'
    });

    this.version(2).stores({
      issues: '++id,&key,name,createdAt'
    }).upgrade((trans: Transaction) => migrateV2(this, trans));

    this.sheet = this.table('sheet');
    this.issues = this.table('issues');
  }
}

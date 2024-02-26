import Dexie, { Transaction } from 'dexie';
import { Sheet, Issue } from '../dto';
import migrateV2 from './migrate-v2';
import migrateV3 from './migrate-v3';

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
    }).upgrade((tx: Transaction) => migrateV2(this, tx));

    this.version(3).stores({
      issues: '++id,&key,name,activities,createdAt'
    }).upgrade((tx: Transaction) => migrateV3(this, tx))

    this.sheet = this.table('sheet');
    this.issues = this.table('issues');
  }
}

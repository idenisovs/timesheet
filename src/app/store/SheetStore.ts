import Dexie, { Transaction } from 'dexie';

import { WeekRecord, DayRecord, ProjectRecord, IssueRecord, ActivityRecord, SheetRecord } from './records';

import migrateV2 from './migrate-v2';
import migrateV3 from './migrate-v3';
import migrateV5 from './migrate-v5';
import migrateV7 from './migrate-v7';
import migrateV8 from './migrate-v8';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<SheetRecord, string>;
  issues: Dexie.Table<IssueRecord, string>;
  projects: Dexie.Table<ProjectRecord, string>;

  weeks: Dexie.Table<WeekRecord, string>;
  days: Dexie.Table<DayRecord, string>;
  activities: Dexie.Table<ActivityRecord, string>;

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
    }).upgrade((tx: Transaction) => migrateV3(this, tx));

    this.version(4).stores({
      projects: 'id,&name,description,*keys,createdAt'
    });

    this.version(5).stores({
      weeks: 'id,from,till',
      days: 'id,&date,weekId',
      activities: 'id,name,date,weekId,dayId',
      issues: '++id,&key,name,*activities,createdAt'
    }).upgrade((tx: Transaction) => migrateV5(this, tx));

    this.version(6).upgrade((tx: Transaction) => tx.table('sheet').clear());
    this.version(7).upgrade((tx: Transaction) => migrateV7(this, tx));
    this.version(8).stores({
      activities: '&id,name,date,weekId,dayId,issueId',
      issues: '&id,&key,name,activities,createdAt'
    }).upgrade((tx: Transaction) => migrateV8(this, tx));

    this.sheet = this.table('sheet');
    this.issues = this.table('issues');
    this.projects = this.table('projects');

    this.weeks = this.table('weeks');
    this.days = this.table('days');
    this.activities = this.table('activities');
  }
}

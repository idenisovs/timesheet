import Dexie, { Transaction } from 'dexie';

import { Sheet } from '../dto';
import { WeekRecord, DayRecord, ProjectEntity, IssueEntity, ActivityEntity } from './entities';

import index from './migrate-v2';
import migrateV3 from './migrate-v3';
import migrateV5 from './migrate-v5';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  issues: Dexie.Table<IssueEntity, string>;
  projects: Dexie.Table<ProjectEntity, string>;

  weeks: Dexie.Table<WeekRecord, string>;
  days: Dexie.Table<DayRecord, string>;
  activities: Dexie.Table<ActivityEntity, string>;

  constructor() {
    super('timesheet');

    this.version(1).stores({
      sheet: '++id,date,activities'
    });

    this.version(2).stores({
      issues: '++id,&key,name,createdAt'
    }).upgrade((tx: Transaction) => index(this, tx));

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

    this.sheet = this.table('sheet');
    this.issues = this.table('issues');
    this.projects = this.table('projects');

    this.weeks = this.table('weeks');
    this.days = this.table('days');
    this.activities = this.table('activities');
  }
}

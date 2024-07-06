import Dexie, { Transaction } from 'dexie';
import { Sheet, Issue, Project, Activity } from '../dto';
import migrateV2 from './migrate-v2';
import migrateV3 from './migrate-v3';
import migrateV5 from './migrate-v5';
import { WeekEntity, DayEntity } from './entities';

export default class SheetStore extends Dexie {
  sheet: Dexie.Table<Sheet, number>;
  issues: Dexie.Table<Issue, number>;
  projects: Dexie.Table<Project, string>;

  weeks: Dexie.Table<WeekEntity, string>;
  days: Dexie.Table<DayEntity, string>;
  activities: Dexie.Table<Activity, string>;

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

    // TODO: Fix version number
    this.version(11).stores({
      weeks: 'id,from,till',
      days: 'id,&date,weekId',
      activities: 'id,name,date,weekId,dayId'
    }).upgrade((tx: Transaction) => migrateV5(this, tx));

    this.sheet = this.table('sheet');
    this.issues = this.table('issues');
    this.projects = this.table('projects');

    this.weeks = this.table('weeks');
    this.days = this.table('days');
    this.activities = this.table('activities');
  }
}

import { Transaction } from 'dexie';

import SheetStore from '../SheetStore';
import { getDateString, getMonday, startOfDay } from '../../utils';
import { Activity, Week, Day } from '../../dto';
import { Sheet } from './types';

export default async function migrateV5(store: SheetStore, trans: Transaction) {
  // @ts-ignore
  const sheets = await store['sheet'].orderBy('date').reverse().toArray();
  const weeks = groupByWeek(sheets);
  const activities = getAllActivities(sheets);
  const days = groupByDay(activities);
  const issues = await store.issues.toArray();

  for (let issue of issues) {
    await store.issues.delete(issue.id);
    issue.id = crypto.randomUUID();
    await store.issues.add(issue);
  }

  return Promise.all([
    trans.table('weeks').bulkPut(weeks),
    trans.table('days').bulkPut(days),
    trans.table('activities').bulkPut(activities),
  ]);
}

function groupByWeek(sheets: Sheet[]): Week[] {
  const weeks: Week[] = [];
  let week = new Week(new Date(sheets[0].date));

  for (let currentSheet of sheets) {
    const currentMonday = getMonday(currentSheet.date);

    if (week.from.toDateString() !== currentMonday.toDateString()) {
      weeks.push(week);
      week = new Week(new Date(currentSheet.date));
    }

    currentSheet.activities.forEach((activity: Activity) => {
      activity.id = crypto.randomUUID();
      activity.date = new Date(currentSheet.date);
      activity.weekId = week.id;
    });
  }

  weeks.push(week);

  return weeks;
}

function getAllActivities(sheets: Sheet[]): Activity[] {
  return sheets.reduce((result: Activity[], sheet: Sheet) => {
    result.push(...sheet.activities);
    return result;
  }, []);
}

function groupByDay(activities: Activity[]): Day[] {
  const days = new Map<string, Day>();

  for (let activity of activities) {
    const date = getDateString(activity.date);

    if (days.has(date)) {
      const day = days.get(date) as Day;

      activity.dayId = day.id;
    } else {
      const day = new Day();
      day.date = startOfDay(activity.date);
      day.weekId = activity.weekId;

      days.set(date, day);

      activity.dayId = day.id;
    }
  }

  return Array.from(days.values());
}

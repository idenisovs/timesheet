import { Transaction } from 'dexie';

import SheetStore from './SheetStore';
import { getMonday } from '../utils';
import { Activity, Sheet, Week } from '../dto';

export default async function migrateV5(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const weeks = groupByWeek(sheets);
  const activities = getAllActivities(sheets);

  return Promise.all([
    trans.table('weeks').bulkPut(weeks),
    trans.table('activities').bulkPut(activities)
  ]);
}

function groupByWeek(sheets: Sheet[]): Week[] {
  const weeks: Week[] = [];
  let week = new Week(new Date(sheets[0].date));

  for (let currentSheet of sheets) {
    const currentMonday = getMonday(currentSheet.date);

    if (week.monday.toDateString() !== currentMonday.toDateString()) {
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

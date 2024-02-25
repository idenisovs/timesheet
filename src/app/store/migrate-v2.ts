import { Transaction } from 'dexie';
import SheetStore from './SheetStore';
import { getTasks } from '../utils/tasks';

export default async function migrateV2(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const tasks = getTasks(sheets);
  return trans.table('tasks').bulkAdd(tasks);
}





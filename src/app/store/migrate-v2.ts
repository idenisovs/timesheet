import { Transaction } from 'dexie';
import SheetStore from './SheetStore';
import { getIssuesFromSheets } from '../utils';

export default async function migrateV2(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const issues = getIssuesFromSheets(sheets);
  return trans.table('issues').bulkAdd(issues);
}





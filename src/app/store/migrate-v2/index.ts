import { Transaction } from 'dexie';

import SheetStore from '../SheetStore';
import { getIssuesFromSheets } from './get-issues-from-sheets';

export default async function index(store: SheetStore, trans: Transaction) {
  // @ts-ignore
  const sheets = await store['sheet'].orderBy('date').reverse().toArray();
  const issues = getIssuesFromSheets(sheets);
  return trans.table('issues').bulkAdd(issues);
}

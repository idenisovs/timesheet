import { Transaction } from 'dexie';
import SheetStore from './SheetStore';
import { getIssuesFromSheets } from '../utils';
import { CreateIssue } from '../dto';

export default async function migrateV3(store: SheetStore, trans: Transaction) {
  const sheets = await store.sheet.orderBy('date').reverse().toArray();
  const issues: CreateIssue[] = getIssuesFromSheets(sheets);

  for (let issue of issues) {
    const existingIssue = await store.issues.where('key').equals(issue.key).first();

    if (existingIssue) {
      issue.id = existingIssue.id;
    }
  }

  return trans.table('issues').bulkPut(issues);
}

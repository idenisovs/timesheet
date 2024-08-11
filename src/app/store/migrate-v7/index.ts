import { Transaction } from 'dexie';

import SheetStore from '../SheetStore';
import { IssueRecord as OldIssueRecord } from './types';
import { IssueRecord } from '../records';


export default async function migrateV7(store: SheetStore, trans: Transaction) {
  const prevIssueRecords = await store.issues.toArray() as unknown as OldIssueRecord[];

  const updatedIssueRecords: IssueRecord[] = prevIssueRecords.map((oldIssue: OldIssueRecord) => {
    return Object.assign({}, oldIssue, {
      activities: oldIssue.activities.length
    });
  });

  return trans.table('issues').bulkPut(updatedIssueRecords);
}



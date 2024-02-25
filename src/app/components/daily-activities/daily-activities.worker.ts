/// <reference lib="webworker" />

import SheetStore from '../../store/SheetStore';
import { Issue } from '../../dto';
import { getIssuesFromSheets } from '../../utils';

addEventListener('message', async ({ data }: { data: 'issue-sync' }) => {
  if (data !== 'issue-sync') {
    throw new Error(`Unknown action ${data} is requested!`);
  }

  const db = new SheetStore();

  const sheets = await db.sheet.toArray()
  const issues = getIssuesFromSheets(sheets);

  for (let issue of issues) {
    const existingIssue = await db.issues.where('key').equals(issue.key).first();

    if (existingIssue) {
      await db.issues.update(existingIssue, issue);
    } else {
      await db.issues.add(issue as Issue);
    }
  }

  const existingIssues = await db.issues.toArray();

  for (let existingIssue of existingIssues) {
    const issue = issues.find((item) => item.key === existingIssue.key)

    if (!issue && existingIssue.activities > 0) {
      existingIssue.activities = 0;
      existingIssue.duration = '';
      await db.issues.put(existingIssue);
    }
  }
});

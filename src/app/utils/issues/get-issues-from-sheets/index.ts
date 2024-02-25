import { CreateIssue, Sheet } from '../../../dto';
import upsertIssue from './upsert-issue';

export function getIssuesFromSheets(sheets: Sheet[]): CreateIssue[] {
  const issues = new Map<string, CreateIssue>();

  sheets.forEach((timesheet) => {
    timesheet.activities.forEach((activity) => {
      upsertIssue(issues, activity, new Date(timesheet.date));
    });
  });

  return Array.from(issues.values());
}

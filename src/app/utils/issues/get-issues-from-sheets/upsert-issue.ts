import { Activity, CreateIssue } from '../../../dto';
import updateIssue from './update-issue';
import createIssue from './create-issue';


export default function upsertIssue(issues: Map<string, CreateIssue>, activity: Activity, sheetDate: Date) {
  if (!activity.name.match(/\w+-\d+/)) {
    return;
  }

  const issueKey = activity.name.split(':')[0];

  if (issues.has(issueKey)) {
    updateIssue(issues, issueKey, activity, sheetDate);
  } else {
    createIssue(issues, issueKey, activity, sheetDate);
  }
}

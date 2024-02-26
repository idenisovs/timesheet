import { sumDuration } from '../../date';
import { Activity, CreateIssue } from '../../../dto';


export default function updateIssue(issues: Map<string, CreateIssue>, issueKey: string, activity: Activity, sheetDate: Date) {
  const issue = issues.get(issueKey) as CreateIssue;

  issue.activities.push(activity);
  issue.duration = sumDuration(issue.duration, activity.duration);

  if (issue.createdAt > sheetDate) {
    issue.createdAt = sheetDate;
  }
}

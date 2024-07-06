import { sumDuration } from '../../../utils';
import { Activity } from '../../../dto';
import { CreateIssue } from '../types';

export default function updateIssue(issues: Map<string, CreateIssue>, issueKey: string, activity: Activity, sheetDate: Date) {
  const issue = issues.get(issueKey) as CreateIssue;

  issue.activities.push({
    ...activity,
    createdAt: sheetDate
  });

  issue.duration = sumDuration(issue.duration, activity.duration);

  if (issue.createdAt > sheetDate) {
    issue.createdAt = sheetDate;
  }
}

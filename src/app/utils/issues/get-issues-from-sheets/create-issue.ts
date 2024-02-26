import { Activity, CreateIssue } from '../../../dto';

export default function createIssue(issues: Map<string, CreateIssue>, issueKey: string, activity: Activity, sheetDate: Date) {
  issues.set(issueKey, {
    key: issueKey,
    name: '',
    activities: [activity],
    duration: activity.duration,
    createdAt: sheetDate
  });
}

import { CreateIssue, Activity } from '../types';

export default function createIssue(issues: Map<string, CreateIssue>, issueKey: string, activity: Activity, sheetDate: Date) {
  const [, ...issueName] = activity.name.split(':')

  issues.set(issueKey, {
    key: issueKey,
    name: issueName.join(':').trim(),
    activities: [{
      ...activity,
      createdAt: sheetDate,
    }],
    duration: activity.duration,
    createdAt: sheetDate
  });
}

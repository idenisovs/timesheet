import { Issue } from './Issue';
import { ImportedActivity } from '../pages/import-page/Imports';
import { ActivityRecord } from '../store/records';

export class Activity {
  id = crypto.randomUUID() as string;
  name = '';
  date = new Date();
  from = '';
  till = '';
  duration = '0m';
  weekId = '';
  dayId = '';
  issueId = '';

  constructor(entity?: Activity) {
    if (!entity) {
      return;
    }

    Object.assign(this, entity);
  }

  getIssueKey(): string | null {
    const match = this.name.match(Issue.KEY_PATTERN);

    if (!match) {
      return null;
    }

    const [issueKey] = match;

    return issueKey;
  }

  getProjectKey(): string | null {
    const issueKey = this.getIssueKey();

    if (!issueKey) {
      return null;
    }

    const [projectKey] = issueKey.split('-');

    return projectKey;
  }

  hasIssueKey(): boolean {
    return !!this.name.match(Issue.KEY_PATTERN);
  }

  getShortName(): string {
    const issueKey = this.getIssueKey();

    let name = this.name;

    if (issueKey) {
      name = name.replace(issueKey, '');
    }

    if (name.startsWith(':')) {
      name = name.slice(1);
    }

    return name.trim();
  }

  equals(other: Activity): boolean {
    if (
      this.id !== other.id
      || this.name !== other.name
      || this.from !== other.from
      || this.till !== other.till
      || this.duration !== other.duration
      || this.weekId !== other.weekId
      || this.dayId !== other.dayId
      || this.issueId !== other.issueId
    ) {
      return false;
    }

    return this.date.getTime() === other.date.getTime();
  }

  static fromImport(activityImport: ImportedActivity): Activity {
    const activity = new Activity();

    Object.assign(activity, activityImport, {
      date: new Date(activityImport.date)
    });

    return activity;
  }

  static fromRecord(record: ActivityRecord): Activity {
    const activity = new Activity();
    Object.assign(activity, record);
    return activity;
  }
}

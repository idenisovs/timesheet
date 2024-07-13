import { Issue } from './Issue';

export class Activity {
  id = crypto.randomUUID() as string;
  name = '';
  date = new Date();
  from = '';
  till = '';
  duration = '0m';
  weekId = '';
  dayId = '';
  isImported?: boolean;

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

  isActive(): boolean {
    if (!this.duration.trim().length) {
      return false;
    }

    return !this.duration.startsWith('0');
  }
}

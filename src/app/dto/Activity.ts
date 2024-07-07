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

  getIssueKey(): string | null {
    const match = this.name.match(Issue.KEY_PATTERN);

    if (!match) {
      return null;
    }

    const [issueKey] = match;

    return issueKey;
  }
}

import { IssueRecord } from '../store/records';
import { ImportedIssue } from '../pages/import-page/Imports';

export class Issue {
  public static readonly KEY_PATTERN = /^\w+-\d+/;

  id = crypto.randomUUID() as string;
  key = '';
  name = '';
  activities = 0;
  duration = '0m';
  estimate?: string;
  createdAt = new Date();

  get FullName(): string {
    if (this.key) {
      return `${this.key}: ${this.name}`;
    } else {
      return this.name;
    }
  }

  constructor(props?: Partial<Issue>) {
    if (!props) {
      return;
    }

    Object.assign(this, props);

    if (props.createdAt) {
      this.createdAt = new Date(props.createdAt);
    }
  }

  equals(other: Issue): boolean {
    if (
      this.name !== other.name
      || this.key !== other.key
      || this.duration !== other.duration
    ) {
      return false;
    }

    if (!!this.estimate || !!other.estimate) {
      if (this.estimate !== other.estimate) {
        return false;
      }
    }

    return this.createdAt.getTime() === other.createdAt.getTime();
  }

  static fromRecord(record: IssueRecord): Issue {
    const issue = new Issue();

    Object.assign(issue, record);

    issue.createdAt = new Date(record.createdAt);

    return issue;
  }

  static fromImport(importedIssue: ImportedIssue): Issue {
    const issue = new Issue();

    Object.assign(issue, importedIssue);

    issue.createdAt = new Date(importedIssue.createdAt);

    return issue;
  }
}

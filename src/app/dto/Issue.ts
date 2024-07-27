import { IssueEntity } from '../store/entities';

export class Issue {
  public static readonly KEY_PATTERN = /^\w+-\d+/;

  id = crypto.randomUUID() as string;
  key = '';
  name = '';
  activities: string[] = [];
  duration = '0m';
  estimate?: string;
  createdAt = new Date();

  constructor(props?: Partial<Issue>) {
    if (!props) {
      return;
    }

    Object.assign(this, props);

    if (props.createdAt) {
      this.createdAt = new Date(props.createdAt);
    }
  }

  static fromRecord(record: IssueEntity): Issue {
    const issue = new Issue();

    Object.assign(issue, record);

    issue.createdAt = new Date(record.createdAt);

    return issue;
  }
}

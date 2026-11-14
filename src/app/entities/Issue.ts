import { IssueRecord } from '@store/records';
import { ImportedIssue } from '@views/import-view/Imports';

export class Issue {
	public static readonly KEY_PATTERN = /^\w+-\d+/;

	id = crypto.randomUUID() as string;
	key = '';
	name = '';
	activities = 0;
	duration = '0m';
	estimate?: string;
	color?: string;
	createdAt = new Date();

	get ProjectKey(): string {
		return this.key.split('-')[0];
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
		return this.name === other.name
			&& this.key === other.key
			&& this.duration === other.duration
			&& ((!this.estimate && !other.estimate) || this.estimate === other.estimate)
			&& this.createdAt.getTime() === other.createdAt.getTime();
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

import { IssueRecord } from '@store/records';
import { ImportedIssue } from '@views/import-view/Imports';
import { getId } from '@utils/get-id';

export class Issue {
	public static readonly KEY_PATTERN = /^\w+-\d+/;

	id = getId();
	key = '';
	name = '';
	activities = 0;
	duration = '0m';
	estimate?: string;
	color?: string;
	createdAt = new Date();
	updatedAt = new Date();

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

		if (props.updatedAt) {
			this.updatedAt = new Date(props.updatedAt);
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
		issue.updatedAt = new Date(record.updatedAt);

		return issue;
	}

	static fromImport(importedIssue: ImportedIssue): Issue {
		const issue = new Issue();

		Object.assign(issue, importedIssue);

		issue.createdAt = importedIssue.createdAt ? new Date(importedIssue.createdAt) : new Date();
		issue.updatedAt = importedIssue.updatedAt ? new Date(importedIssue.updatedAt) : issue.createdAt;

		return issue;
	}
}

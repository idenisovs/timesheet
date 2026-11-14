import { ChangeRecord } from '@store/records';

export class Change {
	id = crypto.randomUUID() as string;
	entity: ChangeRecord['entity'] = 'activity';
	before: ChangeRecord['before'] = null;
	after: ChangeRecord['after'] = null;
	createdAt = new Date();
	syncedAt: Date | null = null;

	constructor(change?: Partial<Change>) {
		if (change) {
			Object.assign(this, change);
		}
	}

	static fromRecord(record: ChangeRecord): Change {
		const change = new Change();
		Object.assign(change, record);
		return change;
	}
}

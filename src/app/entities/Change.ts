import { ChangeRecord } from '@store/records';

export class Change {
	id = crypto.randomUUID() as string;
	entity: ChangeRecord['entity'] = 'activity';
	entityId = '';
	before: ChangeRecord['before'] = null;
	after: ChangeRecord['after'] = null;
	createdAt = new Date();
	syncedAt: Date | null = null;

	constructor(change?: Partial<Change>) {
		if (change) {
			Object.assign(this, change);
		}

		if (!this.entityId) {
			this.entityId = this.after?.id ?? this.before?.id ?? '';
		}
	}
}

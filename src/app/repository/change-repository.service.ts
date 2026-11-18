import { inject, Injectable } from '@angular/core';
import { liveQuery } from 'dexie';

import { Change } from '@entities';
import { SheetStoreService } from '@services/sheet-store.service';

@Injectable({
	providedIn: 'root',
})
export class ChangeRepositoryService {
	private readonly store = inject(SheetStoreService);
	private readonly db = this.store.Instance;

	readonly hasPendingChanges$ = liveQuery(async () => {
		const count = await this.db.changes
			.where('status')
			.equals('pending')
			.count();

		return count > 0;
	});

	async save(changes: Change[]): Promise<void> {
		if (changes.length === 0) {
			return;
		}

		await this.db.changes.bulkAdd(changes);
	}

	async getPendingBatch(limit = 500): Promise<Change[]> {
		const records = await this.db.transaction('r', this.db.changes, () => {
			return this.db.changes
				.where('status')
				.equals('pending')
				.limit(limit)
				.toArray();
		});

		return records.map(record => new Change(record));
	}

	async update(changes: Change[]): Promise<void> {
		const updates = changes.map(change => {
			const { id, ...fields } = change;
			return { key: id, changes: fields };
		});

		await this.db.changes.bulkUpdate(updates);
	}
}

import { inject, Injectable } from '@angular/core';
import { Change } from '@entities';
import { SheetStoreService } from '@services/sheet-store.service';

@Injectable({
	providedIn: 'root',
})
export class ChangeRepositoryService {
	private readonly store = inject(SheetStoreService);
	private readonly db = this.store.Instance;

	async save(changes: Change[]): Promise<void> {
		await this.db.changes.bulkAdd(changes);
	}
}

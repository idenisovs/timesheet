import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, filter, firstValueFrom, from } from 'rxjs';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SyncApiService } from './sync-api';
import { Change } from '@entities';
import ms from 'ms';
import { SyncLiveService } from './sync-live.service';

@Injectable({ providedIn: 'root' })
export class SyncService {
	private readonly changeRepo = inject(ChangeRepositoryService);
	private readonly syncApi = inject(SyncApiService);
	private readonly syncLive = inject(SyncLiveService);

	private syncing = false;

	readonly lastSyncedAt$ = from(this.changeRepo.lastSyncedAt$);

	constructor() {
		const pendingChanges$ = from(this.changeRepo.hasPendingChanges$);
		const syncStatus$ = toObservable(this.syncLive.status);

		combineLatest([pendingChanges$, syncStatus$]).pipe(
			debounceTime(ms('1s')),
			filter(([hasPendingChanges, status]) => hasPendingChanges && status === 'alive'),
			takeUntilDestroyed(),
		).subscribe(() => void this.sync());
	}

	private async sync(): Promise<void> {
		if (this.syncing) {
			return;
		}

		this.syncing = true;

		while (true) {
			const changes = await this.changeRepo.getPendingBatch();

			if (changes.length === 0) {
				this.syncing = false;
				return;
			}

			// ToDo: Error Handling
			await firstValueFrom(this.syncApi.sync(changes));
			// ToDo: Process Sync Service Response
			this.markSynced(changes);
			await this.changeRepo.update(changes);
		}
	}

	private markSynced(changes: Change[]) {
		const syncedAt = new Date();

		for (const change of changes) {
			change.status = 'synced';
			change.syncedAt = syncedAt;
		}
	}
}

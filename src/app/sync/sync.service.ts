import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
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

	private readonly syncing = signal(false);

	readonly isSyncing = this.syncing.asReadonly();
	readonly lastSyncedAt = toSignal(
		from(this.changeRepo.lastSyncedAt$),
		{ initialValue: null }
	);

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
		if (this.syncing()) {
			return;
		}

		this.syncing.set(true);

		try {
			while (true) {
				const changes = await this.changeRepo.getPendingBatch();

				if (changes.length === 0) {
					return;
				}

				// ToDo: Error Handling
				await firstValueFrom(this.syncApi.sync(changes));
				// ToDo: Process Sync Service Response
				this.markSynced(changes);
				await this.changeRepo.update(changes);
			}
		} finally {
			this.syncing.set(false);
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

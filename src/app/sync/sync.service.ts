import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, filter, firstValueFrom, from, Observable, switchMap } from 'rxjs';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SyncApiService } from './sync-api';
import { SyncLiveService } from './sync-live.service';
import { Change } from '@entities';

@Injectable({ providedIn: 'root' })
export class SyncService {
	private readonly changeRepo = inject(ChangeRepositoryService);
	private readonly syncApi = inject(SyncApiService);
	private readonly syncLive = inject(SyncLiveService);
	private syncing = false;

	constructor() {
		toObservable(this.syncLive.status).pipe(
			// Watch for pending changes only while the sync service is alive.
			switchMap(status => {
				if (status !== 'alive') {
					return EMPTY;
				}

				return this.watchPendingChanges();
			}),
			// Unsubscribe when the service is destroyed.
			takeUntilDestroyed(),
		).subscribe(() => this.launchSyncProcess());
	}

	private watchPendingChanges(): Observable<boolean> {
		return from(this.changeRepo.hasPendingChanges$).pipe(
			// Continue only when there are pending changes.
			filter(hasPendingChanges => hasPendingChanges),
		);
	}

	private async launchSyncProcess(): Promise<void> {
		if (this.syncing) {
			return;
		}

		this.syncing = true;

		void this.sync();
	}

	private async sync(): Promise<void> {
		const changes = await this.changeRepo.getPendingBatch();

		if (changes.length === 0) {
			this.syncing = false;
			return;
		}

		// ToDo: Error Handling
		await firstValueFrom(this.syncApi.sync(changes));
		this.markSynced(changes);
		await this.changeRepo.update(changes);

		await this.sync();
	}

	private markSynced(changes: Change[]) {
		const syncedAt = new Date();

		for (const change of changes) {
			change.status = 'synced';
			change.syncedAt = syncedAt;
		}
	}
}

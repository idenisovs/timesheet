import { inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, EMPTY, map, of, switchMap, tap, timer } from 'rxjs';

import { SettingsService } from '@services/settings.service';
import { ToastService } from '@services/toast.service';
import { SyncService } from './sync-api';

@Injectable({ providedIn: 'root' })
export class SyncLiveService {
	private readonly settingsService = inject(SettingsService);
	private readonly syncService = inject(SyncService);
	private readonly toastService = inject(ToastService);

	private readonly failed = signal(false);

	readonly isFailed = this.failed.asReadonly();

	constructor() {
		toObservable(this.settingsService.settings$).pipe(
			map(settings => settings.syncServiceUrl),
			distinctUntilChanged(),
			switchMap(url => {
				this.failed.set(false);

				if (!url) {
					return EMPTY;
				}

				return timer(0, 60_000).pipe(
					switchMap(() => this.syncService.getHealthcheck().pipe(
						map(() => true),
						catchError(() => of(false)),
					)),
					tap(alive => this.updateStatus(alive)),
				);
			}),
			takeUntilDestroyed(),
		).subscribe();
	}

	private updateStatus(alive: boolean) {
		if (!alive && !this.failed()) {
			this.failed.set(true);
			this.toastService.showError('Timesheet Sync service is unavailable.');
		} else if (alive && this.failed()) {
			this.failed.set(false);
			this.toastService.showSuccess('Timesheet Sync service is alive.');
		}
	}
}

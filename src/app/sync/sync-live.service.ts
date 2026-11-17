import { HttpErrorResponse } from '@angular/common/http';
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
	private readonly healthcheckStatus = signal<'checking' | 'alive' | 'failed'>('checking');
	private readonly healthcheckResponse = signal<string | null>(null);

	readonly isFailed = this.failed.asReadonly();
	readonly status = this.healthcheckStatus.asReadonly();
	readonly lastResponse = this.healthcheckResponse.asReadonly();

	constructor() {
		toObservable(this.settingsService.settings$).pipe(
			map(settings => settings.syncServiceUrl),
			distinctUntilChanged(),
			switchMap(url => {
				this.failed.set(false);
				this.healthcheckStatus.set('checking');
				this.healthcheckResponse.set(null);

				if (!url) {
					return EMPTY;
				}

				return timer(0, 60_000).pipe(
					switchMap(() => this.syncService.getHealthcheck().pipe(
						tap(response => this.healthcheckResponse.set(response.body)),
						map(() => true),
						catchError((error: HttpErrorResponse) => {
							const body = typeof error.error === 'string' ? error.error : null;
							this.healthcheckResponse.set(body);
							return of(false);
						}),
					)),
					tap(alive => this.updateStatus(alive)),
				);
			}),
			takeUntilDestroyed(),
		).subscribe();
	}

	private updateStatus(alive: boolean) {
		this.healthcheckStatus.set(alive ? 'alive' : 'failed');

		if (!alive && !this.failed()) {
			this.failed.set(true);
			this.toastService.showError('Timesheet Sync service is unavailable.');
		} else if (alive && this.failed()) {
			this.failed.set(false);
			this.toastService.showSuccess('Timesheet Sync service is alive.');
		}
	}
}

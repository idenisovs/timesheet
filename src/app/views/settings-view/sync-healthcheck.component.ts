import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';

import { SyncService } from '../../sync/sync.service';

@Component({
	selector: 'app-sync-healthcheck',
	templateUrl: './sync-healthcheck.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SyncHealthcheckComponent {
	private readonly syncService = inject(SyncService);

	protected readonly status = signal('Checking sync service…');
	protected readonly response = signal('');

	constructor() {
		effect(onCleanup => {
			this.status.set('Checking sync service…');
			this.response.set('');

			const request = this.syncService.getHealthcheck().pipe(
				tap(result => {
					this.status.set(`HTTP ${result.status}`);
					this.response.set(result.body ?? '');
				}),
				catchError((error: HttpErrorResponse) => {
					if (error.status === 0) {
						this.status.set('Could not contact the sync service.');
						return EMPTY;
					}

					this.status.set(`HTTP ${error.status}`);
					this.response.set(typeof error.error === 'string' ? error.error : '');
					return EMPTY;
				}),
			).subscribe();

			onCleanup(() => request.unsubscribe());
		});
	}
}

import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { SyncService } from '../../sync/sync.service';

@Component({
	imports: [AsyncPipe, DatePipe],
	selector: 'app-sync-status-panel',
	styleUrl: './sync-status-panel.component.scss',
	templateUrl: './sync-status-panel.component.html',
})
export class SyncStatusPanelComponent {
	private readonly syncService = inject(SyncService);

	protected readonly lastSyncedAt$ = this.syncService.lastSyncedAt$;
}

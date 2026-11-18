import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SyncLiveService } from '../../sync/sync-live.service';

@Component({
	selector: 'app-sync-healthcheck',
	templateUrl: './sync-healthcheck.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [],
})
export class SyncHealthcheckComponent {
	protected readonly syncLiveService = inject(SyncLiveService);
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SyncLiveService } from '../../../sync/sync-live.service';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'app-sync-healthcheck',
	templateUrl: './sync-healthcheck.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [
		JsonPipe,
	],
})
export class SyncHealthcheckComponent {
	protected readonly syncLiveService = inject(SyncLiveService);
}

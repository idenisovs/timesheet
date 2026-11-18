import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SyncHealthcheckComponent } from './sync-healthcheck.component';

@Component({
	selector: 'app-sync-view',
	imports: [SyncHealthcheckComponent],
	templateUrl: './sync-view.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SyncViewComponent {}

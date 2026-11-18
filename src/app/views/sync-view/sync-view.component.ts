import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SyncHealthcheckComponent } from './sync-healthcheck.component';

@Component({
	selector: 'app-sync-view',
	imports: [SyncHealthcheckComponent],
	templateUrl: './sync-view.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SyncViewComponent {
	private readonly changeRepo = inject(ChangeRepositoryService);

	protected async resetSync(): Promise<void> {
		await this.changeRepo.resetSync();
	}
}

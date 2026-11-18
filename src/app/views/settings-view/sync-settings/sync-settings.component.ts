import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SettingsService } from '@services/settings.service';
import { SyncServiceUrlComponent } from './sync-service-url.component';

@Component({
	selector: 'app-sync-settings',
	imports: [SyncServiceUrlComponent],
	templateUrl: './sync-settings.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SyncSettingsComponent {
	private readonly settingsService = inject(SettingsService);
	protected readonly settings = this.settingsService.settings$;

	protected toggleSyncService() {
		this.settingsService.update({
			isSyncServiceEnabled: !this.settings().isSyncServiceEnabled
		});
	}
}

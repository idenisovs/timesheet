import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SettingsService } from '@services/settings.service';

@Component({
	selector: 'app-sync-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './sync-settings.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SyncSettingsComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);

	protected readonly form = this.fb.group({
		syncServiceUrl: [this.settingsService.settings$().syncServiceUrl],
	});
	protected isEditing = false;

	protected edit() {
		this.isEditing = true;
	}

	protected save() {
		this.settingsService.update(this.form.getRawValue());
		this.isEditing = false;
	}
}

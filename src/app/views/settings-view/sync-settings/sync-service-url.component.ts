import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SettingsService } from '@services/settings.service';
import { syncUrlValidator } from './sync-url.validator';

@Component({
	selector: 'app-sync-service-url',
	imports: [ReactiveFormsModule],
	templateUrl: './sync-service-url.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SyncServiceUrlComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);

	protected readonly form = this.fb.group({
		syncServiceUrl: [{
			value: this.settingsService.settings$().syncServiceUrl,
			disabled: true
		}, syncUrlValidator],
	});
	protected isEditing = false;

	protected edit() {
		this.form.enable();
		this.isEditing = true;
	}

	protected save() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.settingsService.update(this.form.getRawValue());
		this.form.disable();
		this.isEditing = false;
	}

	protected cancel() {
		this.form.reset({
			syncServiceUrl: this.settingsService.settings$().syncServiceUrl,
		});
		this.form.disable();
		this.isEditing = false;
	}

	protected remove() {
		this.form.controls.syncServiceUrl.setValue('');
		this.save();
	}
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder } from '@angular/forms';

import { SettingsService } from '@services/settings.service';
import { DiagnosticPanelSettingsComponent } from './diagnostic-panel-settings/diagnostic-panel-settings.component';

@Component({
	selector: 'app-diagnostics-settings',
	imports: [DiagnosticPanelSettingsComponent],
	templateUrl: './diagnostics-settings.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class DiagnosticsSettingsComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);

	protected readonly form = this.fb.group({
		isDiagnosticPanelVisible: [this.settingsService.settings$().isDiagnosticPanelVisible],
	});

	constructor() {
		this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
			this.settingsService.update(value);
		});
	}
}

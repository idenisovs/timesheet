import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';

import { ActivityColorControllerService } from '../activity-color-controller.service';
import { SettingsService } from '@services/settings.service';

@Component({
	selector: 'app-activity-diagnostic-panel',
	templateUrl: './activity-diagnostic-panel.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './activity-diagnostic-panel.component.scss',
})
export class ActivityDiagnosticPanelComponent {
	protected readonly cc = inject(ActivityColorControllerService);
	private readonly settingsService = inject(SettingsService);

	protected readonly isVisible = computed(() => this.settingsService.settings$().isDiagnosticPanelVisible);
}

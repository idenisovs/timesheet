import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SettingsService } from '../../services/settings.service';
import { AppSettings } from '../../entities';
import { TimeRoundingSettingsComponent } from './time-rounding-settings/time-rounding-settings.component';
import { ColorModeSettingsComponent } from './color-mode-settings/color-mode-settings.component';
import { ColorRegenerateSettingsComponent } from './color-regenerate-settings/color-regenerate-settings.component';
import { DisplayEmptyWeeksSettingsComponent } from './display-empty-weeks-settings/display-empty-weeks-settings.component';
import { DiagnosticPanelSettingsComponent } from './diagnostic-panel-settings/diagnostic-panel-settings.component';

@Component({
	selector: 'app-settings-view',
	imports: [ReactiveFormsModule, TimeRoundingSettingsComponent, ColorModeSettingsComponent, ColorRegenerateSettingsComponent, DisplayEmptyWeeksSettingsComponent, DiagnosticPanelSettingsComponent],
	templateUrl: './settings-view.component.html',
	styleUrl: './settings-view.component.scss',
})
export class SettingsViewComponent implements OnInit, OnDestroy {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);
	private formSub!: Subscription;

	form = this.fb.group({
		isTimeRoundingEnabled: [false],
		isOppositeColorMode: [false],
		isDisplayEmptyWeeksEnabled: [false],
		isDiagnosticPanelVisible: [false],
	});

	ngOnInit() {
		this.form.patchValue(this.settingsService.settings$());

		this.formSub = this.form.valueChanges.subscribe((value: Partial<AppSettings>) => {
			this.settingsService.update(value);
		});
	}

	ngOnDestroy() {
		this.formSub.unsubscribe();
	}
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SettingsService } from '../../services/settings.service';
import { AppSettings } from '../../entities';
import { TimeRoundingSettingsComponent } from './time-rounding-settings/time-rounding-settings.component';
import { ColorModeSettingsComponent } from './color-mode-settings/color-mode-settings.component';
import { ColorRegenerateSettingsComponent } from './color-regenerate-settings/color-regenerate-settings.component';

@Component({
	selector: 'app-settings-page',
	imports: [ReactiveFormsModule, TimeRoundingSettingsComponent, ColorModeSettingsComponent, ColorRegenerateSettingsComponent],
	templateUrl: './settings-page.component.html',
	styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent implements OnInit, OnDestroy {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);
	private formSub!: Subscription;

	form = this.fb.group({
		isTimeRoundingEnabled: [false],
		isOppositeColorMode: [false],
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

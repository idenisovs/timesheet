import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder } from '@angular/forms';

import { SettingsService } from '@services/settings.service';
import { TimeRoundingSettingsComponent } from './time-rounding-settings/time-rounding-settings.component';
import { ColorModeSettingsComponent } from './color-mode-settings/color-mode-settings.component';
import { ColorRegenerateSettingsComponent } from './color-regenerate-settings/color-regenerate-settings.component';
import { DisplayEmptyWeeksSettingsComponent } from './display-empty-weeks-settings/display-empty-weeks-settings.component';
import { DayEmojisSettingsComponent } from './day-emojis-settings/day-emojis-settings.component';

@Component({
	selector: 'app-general-settings',
	imports: [
		TimeRoundingSettingsComponent,
		ColorModeSettingsComponent,
		ColorRegenerateSettingsComponent,
		DisplayEmptyWeeksSettingsComponent,
		DayEmojisSettingsComponent,
	],
	templateUrl: './general-settings.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class GeneralSettingsComponent {
	private readonly settingsService = inject(SettingsService);
	private readonly fb = inject(NonNullableFormBuilder);

	protected readonly form = this.fb.group({
		isTimeRoundingEnabled: [this.settingsService.settings$().isTimeRoundingEnabled],
		isOppositeColorMode: [this.settingsService.settings$().isOppositeColorMode],
		isDisplayEmptyWeeksEnabled: [this.settingsService.settings$().isDisplayEmptyWeeksEnabled],
		isDayEmojisEnabled: [this.settingsService.settings$().isDayEmojisEnabled],
	});

	constructor() {
		this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
			this.settingsService.update(value);
		});
	}
}

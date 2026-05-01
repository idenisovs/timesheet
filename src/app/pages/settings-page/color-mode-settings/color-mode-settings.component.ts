import { Component, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ColorsService } from '../../../services/colors.service';

@Component({
	selector: 'app-color-mode-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './color-mode-settings.component.html',
})
export class ColorModeSettingsComponent {
	private readonly colorsService = inject(ColorsService);

	form = input.required<FormGroup>();

	protected readonly previewColors = computed(() =>
		Array.from({ length: 15 }, (_, i) => this.colorsService.getColorHsl(i))
	);
}

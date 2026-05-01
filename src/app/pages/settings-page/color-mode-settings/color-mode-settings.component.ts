import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-color-mode-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './color-mode-settings.component.html',
})
export class ColorModeSettingsComponent {
	form = input.required<FormGroup>();
}

import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-time-rounding-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './time-rounding-settings.component.html',
})
export class TimeRoundingSettingsComponent {
	form = input.required<FormGroup>();
}

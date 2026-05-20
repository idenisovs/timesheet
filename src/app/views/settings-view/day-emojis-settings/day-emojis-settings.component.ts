import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-day-emojis-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './day-emojis-settings.component.html',
})
export class DayEmojisSettingsComponent {
	form = input.required<FormGroup>();
}

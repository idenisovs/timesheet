import { Component, input, InputSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-activity-duration-input',
	imports: [ReactiveFormsModule],
	templateUrl: './activity-duration-input.component.html',
	styleUrl: './activity-duration-input.component.scss',
})
export class ActivityDurationInputComponent {
	public control: InputSignal<FormControl<string | null>> = input.required<FormControl<string | null>>();
}

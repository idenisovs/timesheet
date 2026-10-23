import { Component, input, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-activity-name-input',
	imports: [ReactiveFormsModule],
	templateUrl: './activity-name-input.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './activity-name-input.component.scss',
})
export class ActivityNameInputComponent {
	public control: InputSignal<FormControl<string | null>> = input.required<FormControl<string | null>>();
}

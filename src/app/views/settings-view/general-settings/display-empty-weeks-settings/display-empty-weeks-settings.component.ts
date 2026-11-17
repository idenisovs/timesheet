import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-display-empty-weeks-settings',
	imports: [ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './display-empty-weeks-settings.component.html',
})
export class DisplayEmptyWeeksSettingsComponent {
	form = input.required<FormGroup>();
}

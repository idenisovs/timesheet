import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-sync-service-settings',
	imports: [ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './sync-service-settings.component.html',
})
export class SyncServiceSettingsComponent {
	form = input.required<FormGroup>();
}

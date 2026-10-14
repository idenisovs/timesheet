import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-sync-service-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './sync-service-settings.component.html',
})
export class SyncServiceSettingsComponent {
	form = input.required<FormGroup>();
}

import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-diagnostic-panel-settings',
	imports: [ReactiveFormsModule],
	templateUrl: './diagnostic-panel-settings.component.html',
})
export class DiagnosticPanelSettingsComponent {
	form = input.required<FormGroup>();
}

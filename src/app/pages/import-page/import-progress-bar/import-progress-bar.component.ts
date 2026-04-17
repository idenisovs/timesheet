import { Component, input } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-import-progress-bar',
	imports: [
		NgbProgressbar,
	],
	templateUrl: './import-progress-bar.component.html',
	styleUrl: './import-progress-bar.component.scss',
})
export class ImportProgressBarComponent {
	imported = input(0);
	total = input(0);
}

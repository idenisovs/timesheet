import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-settings-view',
	imports: [
		RouterLink,
		RouterLinkActive,
		RouterOutlet,
	],
	templateUrl: './settings-view.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './settings-view.component.scss',
})
export class SettingsViewComponent {}

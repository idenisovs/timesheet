import { Component, input, InputSignal } from '@angular/core';
import { Activity } from '../../../../../../entities';

@Component({
	selector: 'app-day-mobile-activity',
	imports: [],
	templateUrl: './day-mobile-activity.component.html',
	styleUrl: './day-mobile-activity.component.scss',
})
export class DayMobileActivityComponent {
	public activity: InputSignal<Activity> = input.required<Activity>();

	protected subtleColor(color: string | undefined): string {
		if (!color) {
			return '';
		}
		return `color-mix(in srgb, ${color} 3%, transparent)`;
	}

	protected darkerColor(color: string | undefined): string {
		if (!color) {
			return '';
		}
		return `color-mix(in srgb, ${color} 85%, black)`;
	}
}

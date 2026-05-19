import { Component, input, InputSignal } from '@angular/core';
import { Day } from '../../../../../../entities';
import { DayHeaderComponent } from '../../day-header/day-header.component';

@Component({
	selector: 'app-day-mobile-header',
	imports: [
		DayHeaderComponent,
	],
	templateUrl: './day-mobile-header.component.html',
	styleUrl: './day-mobile-header.component.scss',
})
export class DayMobileHeaderComponent {
	public day: InputSignal<Day> = input.required<Day>();
}

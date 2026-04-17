import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Day } from '../../entities';

@Component({
	selector: 'app-daily-activities-week-day-missing',
	imports: [
		DatePipe,
	],
	templateUrl: './daily-activities-week-day-missing.component.html',
	styleUrl: './daily-activities-week-day-missing.component.scss',
})
export class DailyActivitiesWeekDayMissingComponent {
	day = input.required<Day>();
	appendMissingDay = output<Day>();
}

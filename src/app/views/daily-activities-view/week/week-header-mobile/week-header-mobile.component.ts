import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WeekService } from '../week.service';

@Component({
  selector: 'app-week-header-mobile',
	imports: [
		DatePipe,
	],
  templateUrl: './week-header-mobile.component.html',
  styleUrl: './week-header-mobile.component.scss',
})
export class WeekHeaderMobileComponent {
	protected readonly weekService = inject(WeekService);

	toggleMissingDays() {
		this.weekService.toggleMissingDaysVisibility();
	}
}

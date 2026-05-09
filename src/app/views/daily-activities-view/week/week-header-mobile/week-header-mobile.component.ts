import { Component, computed, inject } from '@angular/core';
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
	private readonly weekService = inject(WeekService);

	protected week = computed(() => this.weekService.focusedWeek());

}

import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import {
	ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Day } from '../../entities';
import { ScreenService } from '../../services/screen.service';
import {
	DailyActivitiesWeekDayDesktopComponent,
} from './daily-activities-week-day-desktop/daily-activities-week-day-desktop.component';
import {
	DailyActivitiesWeekDayMobileComponent,
} from './daily-activities-week-day-mobile/daily-activities-week-day-mobile.component';

@Component({
	selector: 'app-daily-activities-week-day',
	imports: [
		ReactiveFormsModule,
		DailyActivitiesWeekDayDesktopComponent,
		DailyActivitiesWeekDayMobileComponent,
	],
	templateUrl: './daily-activities-week-day.component.html',
	styleUrl: './daily-activities-week-day.component.scss',
})
export class DailyActivitiesWeekDayComponent implements OnInit, OnDestroy {
	private readonly screenService = inject(ScreenService);

	public day = input.required<Day>();
	public isMissingDaysVisible = input(false);

	public changes = output<void>();

	protected isMobile = signal<Boolean>(false);
	private isMobileSub!: Subscription;

	async ngOnInit() {
		this.isMobileSub = this.screenService.isMobile$.subscribe((value: boolean) => {
			this.isMobile.set(value);
		});
	}

	ngOnDestroy() {
		this.isMobileSub.unsubscribe();
	}
}

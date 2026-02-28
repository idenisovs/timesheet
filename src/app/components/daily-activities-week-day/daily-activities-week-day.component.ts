import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
	ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Day } from '../../entities';
import { ScreenService } from '../../services/screen.service';
import {
	DailyActivitiesWeekDayDesktopComponent
} from './daily-activities-week-day-desktop/daily-activities-week-day-desktop.component';
import {
	DailyActivitiesWeekDayMobileComponent
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
	private screenService = inject(ScreenService);

	isMobileSub!: Subscription;
	isMobile: boolean = false;

	@Input()
	day!: Day;

	@Output()
	changes = new EventEmitter<void>();

	async ngOnInit() {
		this.isMobileSub = this.screenService.isMobile$.subscribe((value: boolean) => {
			this.isMobile = value;
		});
	}

	ngOnDestroy() {
		this.isMobileSub.unsubscribe();
	}
}

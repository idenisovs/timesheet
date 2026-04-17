import { Component, inject, input, OnInit } from '@angular/core';

import { ActivitySummary, Day, Week } from '../../entities';
import { DaysRepositoryService } from '../../repository/days-repository.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { ActivitiesService } from '../../services/activities.service';
import {
	DailyActivitiesWeekHeaderComponent
} from './daily-activities-week-header/daily-activities-week-header.component';
import {
	DailyActivitiesWeekDayMissingComponent
} from '../daily-activities-week-day-missing/daily-activities-week-day-missing.component';
import { DailyActivitiesWeekDayComponent } from '../daily-activities-week-day/daily-activities-week-day.component';

@Component({
	selector: 'app-daily-activities-week',
	templateUrl: './daily-activities-week.component.html',
	styleUrls: ['./daily-activities-week.component.scss'],
	imports: [DailyActivitiesWeekHeaderComponent, DailyActivitiesWeekDayMissingComponent, DailyActivitiesWeekDayComponent],
})
export class DailyActivitiesWeekComponent implements OnInit {
	private dayRepository = inject(DaysRepositoryService);
	private activityRepository = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);

	days: Day[] = [];
	summary = new ActivitySummary();

	week = input.required<Week>();

	async ngOnInit() {
		this.days = await this.dayRepository.getByWeek(this.week());
		await this.recalculateActivitySummary();
	}

	async recalculateActivitySummary() {
		const activities = await this.activityRepository.getByWeek(this.week());

		this.summary = this.activitiesService.getActivitySummary(activities);
	}
}

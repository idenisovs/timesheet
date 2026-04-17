import { Component, inject, input, OnInit } from '@angular/core';

import { ActivitySummary, Day, Week } from '../../entities';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { ActivitiesService } from '../../services/activities.service';
import {
	DailyActivitiesWeekHeaderComponent,
} from './daily-activities-week-header/daily-activities-week-header.component';
import { DailyActivitiesWeekDayComponent } from '../daily-activities-week-day/daily-activities-week-day.component';
import { getDaysByWeek } from '../../utils/date-v2';

@Component({
	selector: 'app-daily-activities-week',
	templateUrl: './daily-activities-week.component.html',
	styleUrls: ['./daily-activities-week.component.scss'],
	imports: [DailyActivitiesWeekHeaderComponent, DailyActivitiesWeekDayComponent],
})
export class DailyActivitiesWeekComponent implements OnInit {
	private activityRepository = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);

	public week = input.required<Week>();

	protected days: Day[] = [];
	protected summary = new ActivitySummary();
	protected isMissingDaysVisible = false;

	async ngOnInit() {
		this.days = getDaysByWeek(this.week(), true);
		await this.recalculateActivitySummary();
	}

	async recalculateActivitySummary() {
		const activities = await this.activityRepository.getByWeek(this.week());

		this.summary = this.activitiesService.getActivitySummary(activities);
	}
}

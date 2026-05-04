import { Component, inject, input, OnInit, signal } from '@angular/core';

import { ActivitySummary, Day, Week } from '../../entities';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { ActivitiesService } from '../../services/activities.service';
import { SettingsService } from '../../services/settings.service';
import {
	DailyActivitiesWeekHeaderComponent,
} from './daily-activities-week-header/daily-activities-week-header.component';
import { DailyActivitiesWeekDayComponent } from '../daily-activities-week-day/daily-activities-week-day.component';
import { getCurrentDate, getDaysByWeek, getMonday } from '../../utils/date-v2';

@Component({
	selector: 'app-daily-activities-week',
	templateUrl: './daily-activities-week.component.html',
	styleUrls: ['./daily-activities-week.component.scss'],
	imports: [DailyActivitiesWeekHeaderComponent, DailyActivitiesWeekDayComponent],
})
export class DailyActivitiesWeekComponent implements OnInit {
	private activityRepository = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);
	private settingsService = inject(SettingsService);

	public week = input.required<Week>();

	protected days = signal<Day[]>([]);
	protected summary = new ActivitySummary();
	protected isMissingDaysVisible = false;
	protected isHidden = signal(false);

	async ngOnInit() {
		const days: Day[] = getDaysByWeek(this.week(), true);
		this.days.set(days);
		await this.recalculateActivitySummary();
	}

	async recalculateActivitySummary() {
		const activities = await this.activityRepository.getByWeek(this.week());

		this.summary = this.activitiesService.getActivitySummary(activities);

		const isCurrentWeek = this.week().start === getMonday(getCurrentDate());
		const isDisplayEmptyWeeksEnabled = this.settingsService.settings$().isDisplayEmptyWeeksEnabled;
		this.isHidden.set(!isDisplayEmptyWeeksEnabled && activities.length === 0 && !isCurrentWeek);
	}
}

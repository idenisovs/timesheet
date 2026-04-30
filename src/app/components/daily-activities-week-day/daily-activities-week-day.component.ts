import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import {
	ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Activity, Day } from '../../entities';
import { ScreenService } from '../../services/screen.service';
import {
	DailyActivitiesWeekDayDesktopComponent,
} from './daily-activities-week-day-desktop/daily-activities-week-day-desktop.component';
import {
	DailyActivitiesWeekDayMobileComponent,
} from './daily-activities-week-day-mobile/daily-activities-week-day-mobile.component';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { getCurrentDate } from '../../utils/date-v2';
import { RemoveActivitiesWorkflowService } from '../../workflows/remove-activities-workflow.service';
import { SaveActivitiesWorkflowService } from '../../workflows/save-activities-workflow.service';
import {
	DailyActivitiesWeekDayMissingComponent,
} from '../daily-activities-week-day-missing/daily-activities-week-day-missing.component';
import { ActivitiesService } from '../../services/activities.service';

@Component({
	selector: 'app-daily-activities-week-day',
	imports: [
		ReactiveFormsModule,
		DailyActivitiesWeekDayDesktopComponent,
		DailyActivitiesWeekDayMobileComponent,
		DailyActivitiesWeekDayMissingComponent,
	],
	templateUrl: './daily-activities-week-day.component.html',
	styleUrl: './daily-activities-week-day.component.scss',
})
export class DailyActivitiesWeekDayComponent implements OnInit, OnDestroy {
	private readonly screenService = inject(ScreenService);
	private readonly activityRepository = inject(ActivitiesRepositoryService);
	private readonly activitiesService = inject(ActivitiesService);
	private readonly saveActivitiesWorkflow = inject(SaveActivitiesWorkflowService);
	private readonly removeActivitiesWorkflow = inject(RemoveActivitiesWorkflowService);

	public day = input.required<Day>();
	public isMissingDaysVisible = input(false);

	public changes = output<void>();

	protected isMobile = signal<Boolean>(false);
	protected activities = signal<Activity[]>([]);
	private isMobileSub!: Subscription;

	public async ngOnInit() {
		this.isMobileSub = this.screenService.isMobile$.subscribe((value: boolean) => {
			this.isMobile.set(value);
		});

		await this.loadActivities();
	}

	public ngOnDestroy() {
		this.isMobileSub.unsubscribe();
	}

	protected async saveActivities(updatedActivities: Activity[]) {
		const removable: Activity[] = this.findRemovableActivities(updatedActivities);
		await this.removeActivitiesWorkflow.run(removable);
		await this.saveActivitiesWorkflow.run(updatedActivities);
		this.activities.set(updatedActivities);
		this.changes.emit();
	}

	protected async appendMissingDay(day: Day) {
		const activity = this.activitiesService.createActivity(day);
		await this.activityRepository.save([activity]);
		this.activities.set([activity]);
	}

	private async loadActivities() {
		const activities: Activity[] = await this.activityRepository.getByDay(this.day());

		if (activities.length === 0 && this.day().date === getCurrentDate()) {
			activities.push(new Activity().at(this.day()));
		}

		this.activities.set(activities);
	}

	private findRemovableActivities(update: Activity[]) {
		return this.activities().filter((activity: Activity) => {
			return !update.some((updatedActivity: Activity) => {
				return updatedActivity.id === activity.id;
			});
		});
	}
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Activity } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';

@Component({
  selector: 'app-daily-activities-week-day-sticky-bottom',
	imports: [
		NgClass,
	],
  templateUrl: './daily-activities-week-day-sticky-bottom.component.html',
  styleUrl: './daily-activities-week-day-sticky-bottom.component.scss'
})
export class DailyActivitiesWeekDayStickyBottomComponent {
	activitiesService = inject(ActivitiesService);

	@Input()
	activities: Activity[] = [];

	@Input()
	isChanged = false;

	@Output()
	save = new EventEmitter<void>();

	get TotalDuration() {
		return this.activitiesService.calculateDuration(this.activities);
	}
}

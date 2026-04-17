import { Component } from '@angular/core';
import {
	DailyActivitiesWeekDayDesktopComponent
} from '../daily-activities-week-day-desktop/daily-activities-week-day-desktop.component';
import {
	DailyActivitiesWeekDayHeaderComponent
} from '../daily-activities-week-day-header/daily-activities-week-day-header.component';
import {
	DailyActivitiesWeekDayStickyBottomComponent
} from '../daily-activities-week-day-sticky-bottom/daily-activities-week-day-sticky-bottom.component';
import {
	DailyActivityItemMobileComponent
} from '../../daily-activity-item-mobile/daily-activity-item-mobile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Activity } from '../../../entities';
import { ActivityFormGroup } from '../DailyActivitiesForm';

@Component({
	selector: 'app-daily-activities-week-day-mobile',
	imports: [
		DailyActivitiesWeekDayHeaderComponent,
		DailyActivitiesWeekDayStickyBottomComponent,
		DailyActivityItemMobileComponent,
		FormsModule,
		ReactiveFormsModule
	],
	templateUrl: './daily-activities-week-day-mobile.component.html',
	styleUrl: './daily-activities-week-day-mobile.component.scss',
})
export class DailyActivitiesWeekDayMobileComponent extends DailyActivitiesWeekDayDesktopComponent {
	add() {
		const activity = this.service.createActivity(null, this.day());
		const activityFormItem = this.service.makeActivityFormItem(activity);

		const next = [...this.ActivityFormArrayItems];
		next.splice(0, 0, activityFormItem);
		this.form.setControl('activities', this.fb.array(next));
	}

	proceed(activityId: string) {
		const [existingActivity, existingActivityIdx] = this.service.findById(this.activities, activityId);
		const activity: Activity = this.service.continueActivity(existingActivity);
		const activityFormItem: ActivityFormGroup = this.service.makeActivityFormItem(activity);

		const next = [...this.ActivityFormArrayItems];
		next.splice(existingActivityIdx, 0, activityFormItem);
		this.form.setControl('activities', this.fb.array(next));
	}
}

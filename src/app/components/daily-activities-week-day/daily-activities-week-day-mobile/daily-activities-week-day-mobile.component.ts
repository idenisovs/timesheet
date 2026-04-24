import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Activity } from '../../../entities';
import { ActivityFormGroup } from '../DailyActivitiesForm';
import {
	DailyActivitiesWeekDayMissingComponent
} from '../../daily-activities-week-day-missing/daily-activities-week-day-missing.component';

@Component({
	selector: 'app-daily-activities-week-day-mobile',
	imports: [
		DailyActivitiesWeekDayHeaderComponent,
		DailyActivitiesWeekDayStickyBottomComponent,
		DailyActivityItemMobileComponent,
		FormsModule,
		ReactiveFormsModule,
		DailyActivitiesWeekDayMissingComponent,
	],
	templateUrl: './daily-activities-week-day-mobile.component.html',
	styleUrl: './daily-activities-week-day-mobile.component.scss',
})
export class DailyActivitiesWeekDayMobileComponent extends DailyActivitiesWeekDayDesktopComponent {
	add() {
		const activityFormItem = this.createActivityFormItem();
		this.ActivityFormArray.insert(0, activityFormItem);
	}

	proceed(activityId: string) {
		const [existingActivity] = this.service.findById(this.activities(), activityId);
		const activity: Activity = this.service.continueActivity(existingActivity);
		const activityFormItem: ActivityFormGroup = this.service.makeFormItemFromActivity(activity);
		this.ActivityFormArray.insert(0, activityFormItem);
	}
}

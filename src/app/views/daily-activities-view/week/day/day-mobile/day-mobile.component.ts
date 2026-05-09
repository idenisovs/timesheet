import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DayDesktopComponent } from '../day-desktop/day-desktop.component';
import { DayHeaderComponent } from '../day-header/day-header.component';
import { Activity } from '../../../../../entities';
import { ActivityFormGroup } from '../DailyActivitiesForm';
import { DailyActivityItemService } from '../daily-activity-item/daily-activity-item.service';
import { NgClass } from '@angular/common';
import { ActivityTimesComponent } from './activity-times/activity-times.component';

@Component({
	selector: 'app-day-mobile',
	imports: [
		DayHeaderComponent,
		FormsModule,
		ReactiveFormsModule,
		NgClass,
		ActivityTimesComponent,
	],
	templateUrl: './day-mobile.component.html',
	styleUrl: './day-mobile.component.scss',
	providers: [DailyActivityItemService],
})
export class DayMobileComponent extends DayDesktopComponent {
	protected add() {
		const activityFormItem = this.createActivityFormItem();
		this.ActivityFormArray.insert(0, activityFormItem);
	}

	protected proceed(activityId: string) {
		const [existingActivity] = this.service.findById(this.activities(), activityId);
		const activity: Activity = this.service.continueActivity(existingActivity);
		const activityFormItem: ActivityFormGroup = this.service.makeFormItemFromActivity(activity);
		this.ActivityFormArray.insert(0, activityFormItem);
	}

	protected sorted(): Activity[] {
		return this.activitiesService.sort(this.activities(), true);
	}

	protected subtleColor(color: string | undefined): string {
		if (!color) {
			return '';
		}
		return `color-mix(in srgb, ${color} 3%, transparent)`;
	}
}

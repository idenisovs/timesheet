import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { Activity, Day } from '../../entities';
import { ActivityFormItem } from './ActivityFormItem';
import { ActivityFormGroup } from './DailyActivitiesForm';

@Injectable({
	providedIn: 'root',
})
export class DailyActivitiesWeekDayService {
	private readonly fb = inject(FormBuilder);

	public makeActivityFormItem(activity?: Activity): ActivityFormGroup {
		return this.fb.group(new ActivityFormItem(activity));
	}

	public continueActivity(activity: Activity) {
		const nextActivity = new Activity(activity).regenerateId();
		nextActivity.from = activity.till;
		nextActivity.till = '';
		nextActivity.duration = '';
		return nextActivity;
	}

	public findById(activities: Activity[], activityId: string): [Activity, number] {
		const activity = activities.find((activity: Activity) => activity.id === activityId) as Activity;
		const activityIdx = activities.indexOf(activity);
		return [activity, activityIdx];
	}

	public processActivityFormArray(activityFormArray: FormArray<ActivityFormGroup>, day: Day, activities: Activity[]): Activity[] {
		return activityFormArray.value.map((formItem) => {
			const existingActivity = activities.find((activity: Activity) => {
				return activity.id === formItem.id;
			});

			if (existingActivity) {
				return this.updateActivity(formItem, existingActivity);
			} else {
				return this.createActivity(formItem, day);
			}
		});
	}

	private createActivity(formValue?: any, day?: Day): Activity {
		const activity = new Activity();

		if (formValue) {
			Object.assign(activity, formValue);
		}

		if (day) {
			activity.date = day.date;
		}

		return activity;
	}

	private updateActivity(formValue: any, activity: Activity): Activity {
		return Object.assign(activity, formValue);
	}
}

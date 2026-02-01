import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { Activity, Day } from '../../dto';
import { ActivityFormItem } from './ActivityFormItem';
import { ActivityFormGroup } from './DailyActivitiesForm';

@Injectable({
	providedIn: 'root',
})
export class DailyActivitiesWeekDayService {
	private fb = inject(FormBuilder);

	makeActivityFormItem(activity?: Activity): ActivityFormGroup {
		return this.fb.group(new ActivityFormItem(activity));
	}

	processActivityFormArray(activityFormArray: FormArray<ActivityFormGroup>, day: Day, activities: Activity[]): Activity[] {
		return activityFormArray.value.map((item) => {
			const existingActivity = activities.find((activity: Activity) => {
				return activity.id === item.id;
			});

			if (existingActivity) {
				return this.updateActivity(item, existingActivity);
			} else {
				return this.createActivity(item, day);
			}
		});
	}

	createActivity(formValue?: any, day?: Day): Activity {
		const activity = new Activity();

		if (formValue) {
			Object.assign(activity, formValue);
		}

		if (day) {
			activity.date = day.date;
			activity.dayId = day.id;
			activity.weekId = day.weekId;
		}

		return activity;
	}

	updateActivity(formValue: any, activity: Activity): Activity {
		return Object.assign(activity, formValue);
	}

	continueActivity(activity: Activity) {
		const createdActivity = new Activity(activity).regenerateId();
		createdActivity.from = activity.till;
		createdActivity.till = '';
		createdActivity.duration = '';
		return createdActivity;
	}

	findById(activities: Activity[], activityId: string): [Activity, number] {
		const activity = activities.find((activity: Activity) => activity.id === activityId) as Activity;
		const activityIdx = activities.indexOf(activity);
		return [activity, activityIdx];
	}
}

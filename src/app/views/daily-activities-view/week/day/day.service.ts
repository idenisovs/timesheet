import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { Activity, Day } from '../../../../entities';
import { ActivityFormItem } from './ActivityFormItem';
import { ActivityFormGroup } from './DailyActivitiesForm';
import { BarPosition } from './daily-activity-item/color-bar/color-bar.component';

@Injectable({
	providedIn: 'root',
})
export class DayService {
	private readonly fb = inject(FormBuilder);

	public makeFormItemFromActivity(activity?: Activity): ActivityFormGroup {
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

	public getBarPosition(idx: number, items: ActivityFormGroup[]): BarPosition {
		const nameAt = (i: number): string => items[i]?.get('name')?.value ?? '';
		const groupKey = (name: string): string => {
			const colonIdx = name.indexOf(':');
			return colonIdx !== -1 ? name.slice(0, colonIdx + 1) : name;
		};

		const isSameGroup = (a: string, b: string): boolean => {
			if (!a || !b) return false;
			return groupKey(a) === groupKey(b);
		};

		const current = nameAt(idx);
		const sameAsPrev = idx > 0 && isSameGroup(current, nameAt(idx - 1));
		const sameAsNext = idx < items.length - 1 && isSameGroup(current, nameAt(idx + 1));

		if (sameAsPrev && sameAsNext) return BarPosition.Middle;
		if (sameAsPrev) return BarPosition.Last;
		if (sameAsNext) return BarPosition.First;
		return BarPosition.Solo;
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

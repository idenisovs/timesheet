import { Injectable } from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';

import { Activity, Day } from '../../dto';
import { ActivityFormItem } from './ActivityFormItem';
import { ActivityFormGroup } from './DailyActivitiesForm';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesWeekDayService {

  constructor(private fb: FormBuilder) { }

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

  createActivity(formValue: any, day?: Day): Activity {
    const activity = new Activity();

    Object.assign(activity, formValue);

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
}

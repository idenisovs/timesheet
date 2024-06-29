import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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

  createActivity(formValue: any, day?: Day): Activity {
    const activity = new Activity();

    Object.assign(activity, formValue);

    if (day) {
      activity.dayId = day.id;
      activity.weekId = day.weekId;
    }

    return activity;
  }

  updateActivity(activity: Activity, formValue: any) {
    return Object.assign(activity, formValue);
  }
}

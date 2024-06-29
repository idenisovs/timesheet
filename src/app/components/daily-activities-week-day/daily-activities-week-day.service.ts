import { Injectable } from '@angular/core';

import { Activity, Day } from '../../dto';
import { ActivityFormItem } from './ActivityFormItem';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesWeekDayService {

  constructor(private fb: FormBuilder) { }

  makeActivityFormItem(activity?: Activity) {
    return this.fb.group(new ActivityFormItem(activity));
  }

  createActivity(formValue: any, day?: Day) {
    const activity = new Activity();

    Object.assign(activity, formValue);

    if (day) {
      activity.dayId = day.id;
      activity.weekId = day.weekId;
    }

    return activity;
  }
}

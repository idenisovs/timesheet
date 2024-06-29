import { Injectable } from '@angular/core';

import { Activity, Day } from '../../dto';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesWeekDayService {

  constructor() { }

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

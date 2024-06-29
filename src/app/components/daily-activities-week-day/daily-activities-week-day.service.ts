import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Activity, Day } from '../../dto';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesWeekDayService {

  constructor(private fb: FormBuilder) { }

  makeActivityFormGroup(activity?: Activity) {
    if (activity) {
      return this.fb.group({
        id: [activity.id],
        name: [activity.name],
        from: [activity.from],
        till: [activity.till],
        duration: [activity.duration]
      });
    } else {
      return this.fb.group({
        id: [crypto.randomUUID()],
        name: [''],
        from: [''],
        till: [''],
        duration: ['']
      });
    }
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

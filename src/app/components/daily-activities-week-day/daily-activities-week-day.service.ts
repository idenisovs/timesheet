import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Activity } from '../../dto';

@Injectable({
  providedIn: 'root'
})
export class DailyActivitiesWeekDayService {

  constructor(private fb: FormBuilder) { }

  makeActivityFormGroup(activity?: Activity) {
    if (activity) {
      return this.fb.group({
        name: [activity.name],
        from: [activity.from],
        till: [activity.till],
        duration: [activity.duration]
      });
    } else {
      return this.fb.group({
        name: [''],
        from: [''],
        till: [''],
        duration: ['']
      });
    }
  }
}

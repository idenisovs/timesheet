import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { Subscription } from 'rxjs';

import { Activity, Day } from '../../dto';
import { DailyActivityItemComponent } from '../daily-activity-item/daily-activity-item.component';
import { DailyActivitiesService } from '../daily-activities/daily-activities.service';
import { DailyActivitiesWeekDayService } from './daily-activities-week-day.service';

@Component({
  selector: 'app-daily-activities-week-day',
  standalone: true,
  imports: [
    JsonPipe,
    DatePipe,
    ReactiveFormsModule,
    NgForOf,
    DailyActivityItemComponent,
  ],
  templateUrl: './daily-activities-week-day.component.html',
  styleUrl: './daily-activities-week-day.component.scss'
})
export class DailyActivitiesWeekDayComponent implements OnInit, OnDestroy {
  totalDuration = '0h';
  isChanged = false;
  form = this.fb.group({
    activities: this.fb.array([this.service.makeActivityFormGroup()])
  });
  valueChangesHandler?: Subscription;

  get Activities(): UntypedFormGroup[] {
    return (this.form.get('activities') as UntypedFormArray).controls as UntypedFormGroup[];
  }

  @Input()
  day!: Day;

  constructor(
    private fb: FormBuilder,
    private service: DailyActivitiesWeekDayService,
    private dailyActivitiesService: DailyActivitiesService,
  ) {}

  ngOnInit() {
    if (!this.day.activities.length) {
      this.day.activities.push(new Activity())
    }

    const activities = this.day.activities.map((activity: Activity) => {
      return this.service.makeActivityFormGroup(activity);
    });

    this.form.setControl('activities', this.fb.array(activities));
    this.totalDuration = this.dailyActivitiesService.getTotalDuration(this.day.activities);
    this.valueChangesHandler = this.form.valueChanges.subscribe(() => {
      this.isChanged = true;
    });
  }

  ngOnDestroy() {
    if (this.valueChangesHandler) {
      this.valueChangesHandler.unsubscribe();
    }
  }

  add() {
    console.log('Add!');
  }

  remove() {
    console.log('Remove!');
  }

  save() {
    console.log('Save!');
  }
}

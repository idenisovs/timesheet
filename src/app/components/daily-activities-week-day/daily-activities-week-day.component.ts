import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { Subscription } from 'rxjs';

import { Activity, Day } from '../../dto';
import { DailyActivityItemComponent } from '../daily-activity-item/daily-activity-item.component';
import { DailyActivitiesService } from '../daily-activities/daily-activities.service';
import { DailyActivitiesWeekDayService } from './daily-activities-week-day.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

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
  removableActivities: Activity[] = [];

  get Activities(): UntypedFormGroup[] {
    return (this.form.get('activities') as UntypedFormArray).controls as UntypedFormGroup[];
  }

  @Input()
  day!: Day;

  constructor(
    private fb: FormBuilder,
    private service: DailyActivitiesWeekDayService,
    private activitiesService: DailyActivitiesService,
    private activitiesRepository: ActivitiesRepositoryService
  ) {}

  ngOnInit() {
    if (!this.day.activities.length) {
      this.day.activities.push(new Activity())
    }

    const activities = this.day.activities.map((activity: Activity) => {
      return this.service.makeActivityFormGroup(activity);
    });

    this.form.setControl('activities', this.fb.array(activities));
    this.totalDuration = this.activitiesService.getTotalDuration(this.day.activities);
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
    const activities = this.form.get('activities') as UntypedFormArray;
    activities.push(this.service.makeActivityFormGroup());
  }

  remove(idx: number) {
    this.removeActivityFromForm(idx);
    this.removeActivityFromDay(idx);
  }

  removeActivityFromForm(idx: number) {
    const activities = this.form.get('activities') as UntypedFormArray;

    activities.removeAt(idx);

    if (!activities.length) {
      this.add();
    }
  }

  removeActivityFromDay(idx: number) {
    const activity = this.day.activities[idx];

    if (activity) {
      this.removableActivities.push(activity);
      this.day.activities.splice(idx, 1);
    }
  }

  async save() {
    if (this.removableActivities.length) {
      await this.activitiesRepository.remove(this.removableActivities);
      this.removableActivities = [];
    }

    const activitiesFormArray = this.form.get('activities') as UntypedFormArray;

    const activities = activitiesFormArray.value.map((item: any) => {
      const existingActivity = this.day.activities.find((activity: Activity) => activity.id === item.id);

      if (existingActivity) {
        return Object.assign(existingActivity, item);
      } else {
        return this.service.createActivity(item, this.day);
      }
    });

    await this.activitiesRepository.save(activities);

    this.isChanged = false;
  }
}

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
    activities: this.fb.array([
      this.service.makeActivityFormItem()
    ])
  });

  valueChangesHandler?: Subscription;
  removableActivityIds: string[] = [];

  get ActivityForm(): UntypedFormArray {
    return this.form.get('activities') as UntypedFormArray;
  }

  get Activities(): UntypedFormGroup[] {
    return this.ActivityForm.controls as UntypedFormGroup[];
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
    const activityFormItems = this.day.activities.map((activity: Activity) => {
      return this.service.makeActivityFormItem(activity);
    });

    if (activityFormItems.length) {
      this.form.setControl('activities', this.fb.array(activityFormItems));
    }

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
    this.ActivityForm.push(this.service.makeActivityFormItem());
  }

  remove(activityId: string) {
    this.removableActivityIds.push(activityId);

    const idx = this.ActivityForm.value.findIndex((item: any) => item.id === activityId);

    this.ActivityForm.removeAt(idx);

    if (!this.ActivityForm.length) {
      this.add();
    }
  }

  async save() {
    if (this.removableActivityIds.length) {
      await this.activitiesRepository.remove(this.removableActivityIds);
      this.removableActivityIds = [];
    }

    this.day.activities = this.ActivityForm.value.map((item: any) => {
      const existingActivity = this.day.activities.find((activity: Activity) => {
        return activity.id === item.id;
      });

      if (existingActivity) {
        return this.service.updateActivity(existingActivity, item);
      } else {
        return this.service.createActivity(item, this.day);
      }
    });

    await this.activitiesRepository.save(this.day.activities);

    this.totalDuration = this.activitiesService.getTotalDuration(this.day.activities);
    this.isChanged = false;
  }
}

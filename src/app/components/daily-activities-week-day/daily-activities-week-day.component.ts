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
  removableActivityIds: string[] = [];

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
    const activityFormItems = this.day.activities.map((activity: Activity) => {
      return this.service.makeActivityFormGroup(activity);
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
    const activityFormItems = this.form.get('activities') as UntypedFormArray;

    activityFormItems.push(this.service.makeActivityFormGroup());
  }

  remove(idx: number) {
    const activityFormItems = this.form.get('activities') as UntypedFormArray;

    const activityFormItem = activityFormItems.value[idx];
    this.removableActivityIds.push(activityFormItem.id);

    activityFormItems.removeAt(idx);

    if (!activityFormItems.length) {
      this.add();
    }
  }

  async save() {
    if (this.removableActivityIds.length) {
      await this.activitiesRepository.remove(this.removableActivityIds);
      this.removableActivityIds = [];
    }

    const activitiesFormArray = this.form.get('activities') as UntypedFormArray;

    this.day.activities = activitiesFormArray.value.map((item: any) => {
      const existingActivity = this.day.activities.find((activity: Activity) => activity.id === item.id);

      if (existingActivity) {
        return Object.assign(existingActivity, item);
      } else {
        return this.service.createActivity(item, this.day);
      }
    });

    await this.activitiesRepository.save(this.day.activities);

    this.totalDuration = this.activitiesService.getTotalDuration(this.day.activities);
    this.isChanged = false;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { Activity, Day } from '../../dto';
import { DailyActivityItemComponent } from '../daily-activity-item/daily-activity-item.component';
import { DailyActivitiesService } from '../daily-activities/daily-activities.service';

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
export class DailyActivitiesWeekDayComponent implements OnInit {
  totalDuration = '0h';
  form = this.fb.group({
    activities: this.fb.array([
      this.fb.group({
        name: [''],
        from: [''],
        till: [''],
        duration: ['']
      })
    ])
  });

  get Activities(): UntypedFormGroup[] {
    return (this.form.get('activities') as UntypedFormArray).controls as UntypedFormGroup[];
  }

  @Input()
  day!: Day;

  constructor(
    private fb: FormBuilder,
    private dailyActivitiesService: DailyActivitiesService,
  ) {}

  ngOnInit() {
    if (!this.day.activities.length) {
      this.day.activities.push(new Activity())
    }

    const activities = this.day.activities.map((activity) => this.fb.group({
      name: [activity.name],
      from: [activity.from],
      till: [activity.till],
      duration: [activity.duration],
    }));

    this.totalDuration = this.dailyActivitiesService.getTotalDuration(this.day.activities);
    this.form.setControl('activities', this.fb.array(activities));
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

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { Day } from '../../dto';

@Component({
  selector: 'app-daily-activities-week-day',
  standalone: true,
  imports: [
    JsonPipe,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './daily-activities-week-day.component.html',
  styleUrl: './daily-activities-week-day.component.scss'
})
export class DailyActivitiesWeekDayComponent implements OnInit {
  @Input()
  day!: Day;

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.day.activities.length) {
      this.day.activities.push({
        id: crypto.randomUUID(),
        name: '',
        date: new Date(),
        from: '',
        till: '',
        duration: '',
        weekId: this.day.weekId,
        dayId: this.day.id
      })
    }

    const activities = this.day.activities.map((activity) => this.fb.group({
      name: [activity.name],
      from: [activity.from],
      till: [activity.till],
      duration: [activity.duration],
    }));

    this.form.setControl('activities', this.fb.array(activities));
  }
}

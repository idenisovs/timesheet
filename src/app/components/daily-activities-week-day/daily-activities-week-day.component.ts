import { Component, Input } from '@angular/core';
import { Day } from '../../dto';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-daily-activities-week-day',
  standalone: true,
  imports: [
    JsonPipe,
    DatePipe,
  ],
  templateUrl: './daily-activities-week-day.component.html',
  styleUrl: './daily-activities-week-day.component.scss'
})
export class DailyActivitiesWeekDayComponent {
  @Input()
  day!: Day;
}

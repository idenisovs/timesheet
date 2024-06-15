import { Component, Input } from '@angular/core';
import { Day } from '../../dto';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-daily-activities-week-day',
  standalone: true,
  imports: [
    JsonPipe,
  ],
  templateUrl: './daily-activities-week-day.component.html',
  styleUrl: './daily-activities-week-day.component.scss'
})
export class DailyActivitiesWeekDayComponent {
  @Input()
  day!: Day;
}

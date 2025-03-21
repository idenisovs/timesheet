import { Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';

import { Day } from '../../dto';

@Component({
    selector: 'app-daily-activities-week-day-missing',
    imports: [
        NgIf,
        DatePipe
    ],
    templateUrl: './daily-activities-week-day-missing.component.html',
    styleUrl: './daily-activities-week-day-missing.component.scss'
})
export class DailyActivitiesWeekDayMissingComponent {
  @Input()
  day!: Day;

  appendMissingDay() {
    if (this.day) {
      this.day.isMissing = false;
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { duration } from 'yet-another-duration';
import { Sheet, Week } from '../../../dto';
import { calculateTotalDuration, getDateString } from '../../../utils';

type Totals = {
  duration: number;
  activities: number;
}

type DateInterval = {
  min: string,
  max: string
}

@Component({
  selector: 'app-daily-activities-week-header',
  templateUrl: './daily-activities-week-header.component.html',
  styleUrls: ['./daily-activities-week-header.component.scss']
})
export class DailyActivitiesWeekHeaderComponent implements OnInit {
  totals: Totals = {
    duration: 0,
    activities: 0
  };

  @Input()
  week = new Week();

  get TotalHours(): string {
    return duration(this.totals.duration, {
      units: {
        min: 'minutes'
      }
    }).toString();
  }

  get DatesInterval(): DateInterval {
    return this.week.days.reduce<DateInterval>((result: DateInterval, sheet: Sheet) => {
      const currentDate = typeof sheet.date === 'string' ? sheet.date : getDateString(sheet.date);

      if (currentDate < result.min) {
        result.min = currentDate
      }

      if (currentDate > result.max) {
        result.max = currentDate;
      }

      return result;
    }, {
      min: '3000-12-31',
      max: '1980-01-01'
    });
  }

  constructor() { }

  ngOnInit(): void {
    this.totals = this.week.days.reduce<Totals>((result: Totals, sheet: Sheet) => {
      result.duration += calculateTotalDuration(sheet.activities);
      result.activities += sheet.activities.length;
      return result;
    }, {
      activities: 0,
      duration: 0
    });
  }

}

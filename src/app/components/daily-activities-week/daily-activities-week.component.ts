import { Component, Input, OnInit } from '@angular/core';
import { Sheet, Week } from '../../dto';
import { calculateTotalDuration, getDateString } from '../../utils';
import { duration } from 'yet-another-duration';

type Totals = {
  duration: number;
  activities: number;
}

type DateInterval = {
  min: string,
  max: string
}

@Component({
  selector: 'app-daily-activities-week',
  templateUrl: './daily-activities-week.component.html',
  styleUrls: ['./daily-activities-week.component.scss']
})
export class DailyActivitiesWeekComponent implements OnInit {
  @Input()
  week = new Week();

  totals: Totals = {
    duration: 0,
    activities: 0
  };

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
    })
  }
}

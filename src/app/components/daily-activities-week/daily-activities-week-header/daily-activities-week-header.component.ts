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

  showingMissingDays = false;

  get TotalHours(): string {
    if (!this.totals.duration) {
      return '0';
    }

    return duration(this.totals.duration, {
      units: {
        min: 'minutes',
        max: 'hours'
      }
    }).toString();
  }

  get MissingDaysButtonLabel(): string {
    if (this.showingMissingDays) {
      return 'Hide missing days';
    } else {
      return 'Show missing days';
    }
  }

  constructor() { }

  ngOnInit(): void {
    // this.totals = this.week.days.reduce<Totals>((result: Totals, sheet: Sheet) => {
    //   result.duration += calculateTotalDuration(sheet.activities);
    //   result.activities += sheet.activities.length;
    //   return result;
    // }, {
    //   activities: 0,
    //   duration: 0
    // });
  }

  toggleMissingDays() {
    this.showingMissingDays = !this.showingMissingDays;

    // if (this.showingMissingDays) {
    //   this.week.fulfillMissingDays();
    // }  else {
    //   this.week.removeMissingDays();
    // }
  }

}

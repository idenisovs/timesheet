import { Component, Input, OnInit } from '@angular/core';
import { duration } from 'yet-another-duration';

import { Week, WeekSummary } from '../../../dto';

@Component({
  selector: 'app-daily-activities-week-header',
  templateUrl: './daily-activities-week-header.component.html',
  styleUrls: ['./daily-activities-week-header.component.scss']
})
export class DailyActivitiesWeekHeaderComponent implements OnInit {
  totals: WeekSummary = {
    duration: 0,
    activities: 0
  };

  @Input()
  week = new Week();

  isMissingDaysVisible = false;

  get TotalHours(): string {
    if (!this.totals.duration) {
      return '0m';
    }

    return duration(this.totals.duration, {
      units: {
        min: 'minutes',
        max: 'hours'
      }
    }).toString();
  }

  get MissingDaysButtonLabel(): string {
    if (this.isMissingDaysVisible) {
      return 'Hide missing days';
    } else {
      return 'Show missing days';
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.totals = this.week.getSummary();
  }

  toggleMissingDays() {
    this.isMissingDaysVisible = !this.isMissingDaysVisible;

    if (this.isMissingDaysVisible) {
      this.week.showMissingDays();
    }  else {
      this.week.hideMissingDays();
    }
  }
}

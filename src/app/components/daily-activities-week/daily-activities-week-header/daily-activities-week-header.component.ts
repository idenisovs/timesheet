import { Component, Input, OnInit } from '@angular/core';
import { duration } from 'yet-another-duration';

import { Day, Week, DaysSummary } from '../../../dto';
import { DaysService } from '../../../services/days.service';

@Component({
  selector: 'app-daily-activities-week-header',
  templateUrl: './daily-activities-week-header.component.html',
  styleUrls: ['./daily-activities-week-header.component.scss']
})
export class DailyActivitiesWeekHeaderComponent implements OnInit {
  totals: DaysSummary = {
    duration: 0,
    activities: 0
  };

  isMissingDaysVisible = false;

  @Input()
  week = new Week();

  @Input()
  days: Day[] = [];

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

  constructor(
    private daysService: DaysService
  ) { }

  ngOnInit(): void {
    this.totals = this.daysService.getSummary(this.days);
  }

  toggleMissingDays() {
    this.isMissingDaysVisible = !this.isMissingDaysVisible;

    if (this.isMissingDaysVisible) {
      this.daysService.addMissingDays(this.week, this.days);
    }  else {
      this.daysService.removeMissingDays(this.days);
    }
  }
}

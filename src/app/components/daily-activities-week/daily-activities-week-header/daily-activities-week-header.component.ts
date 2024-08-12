import { Component, Input, OnInit } from '@angular/core';

import { Day, Week, ActivitySummary } from '../../../dto';
import { DaysService } from '../../../services/days.service';

@Component({
  selector: 'app-daily-activities-week-header',
  templateUrl: './daily-activities-week-header.component.html',
  styleUrls: ['./daily-activities-week-header.component.scss']
})
export class DailyActivitiesWeekHeaderComponent implements OnInit {
  isMissingDaysVisible = false;

  @Input()
  week = new Week();

  @Input()
  days: Day[] = [];

  @Input()
  summary = new ActivitySummary();

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

  async ngOnInit() {}

  toggleMissingDays() {
    this.isMissingDaysVisible = !this.isMissingDaysVisible;

    if (this.isMissingDaysVisible) {
      this.daysService.addMissingDays(this.week, this.days);
    }  else {
      this.daysService.removeMissingDays(this.days);
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';

import { getDateString } from '../../../utils';
import { ActivitiesTableComponent } from './activities-table/activities-table.component';
import { Activity } from '../../../dto';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    ActivitiesTableComponent
  ],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.scss'
})
export class ActivitiesListComponent implements OnInit {
  @Input()
  activities: Activity[] = [];

  activitiesByDate = new Map<string, Activity[]>();
  activityDates: string[] = [];

  ngOnInit() {
    this.groupByDate();
    this.updateActivityDates();
  }

  private groupByDate() {
    this.activities.forEach((activity: Activity) => {
      const activityDate = getDateString(activity.date);

      if (this.activitiesByDate.has(activityDate)) {
        this.activitiesByDate.get(activityDate)?.push(activity);
      } else {
        this.activitiesByDate.set(activityDate, [ activity ]);
      }
    });
  }

  private updateActivityDates() {
    const dates = Array.from(this.activitiesByDate.keys());

    dates.sort((a: string, b: string) => {
      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    });

    this.activityDates = dates;
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbInputDatepicker, NgbCalendar, NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, KeyValuePipe, NgForOf } from '@angular/common';

import { AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { Activity, ProjectOverview } from '../../dto';
import { AnalyticsPageService } from './analytics-page.service';
import { AnalyticsPageFilterComponent } from './analytics-page-filter/analytics-page-filter.component';
import { ActivityTreeComponent } from './activity-tree/activity-tree.component';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    ReactiveFormsModule,
    JsonPipe,
    KeyValuePipe,
    NgForOf,
    AnalyticsPageFilterComponent,
    ActivityTreeComponent,
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
  ],
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  analytics: Activity[] = [];
  activityTree?: ProjectOverview[];
  isActivitiesVisible: boolean = false;

  constructor(
    private service: AnalyticsPageService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  async updateAnalytics(filters: AnalyticsPageFilters) {
    this.activityTree = await this.service.getAnalytics(filters);
    this.isActivitiesVisible = filters.isActivitiesVisible || false;
  }
}

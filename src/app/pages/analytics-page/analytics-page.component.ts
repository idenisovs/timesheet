import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarGregorian,
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { AnalyticsPageService } from './analytics-page.service';
import { AnalyticsPageFilterComponent } from './analytics-page-filter/analytics-page-filter.component';
import { AnalyticsPageTabsComponent } from './analytics-page-tabs/analytics-page-tabs.component';
import { Analytics } from './types';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AnalyticsPageFilterComponent,
    AnalyticsPageTabsComponent,
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
  ],
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  analytics?: Analytics;
  isActivitiesVisible: boolean = false;
  isIssuesVisible: boolean = true;

  constructor(
    private service: AnalyticsPageService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  async updateAnalytics(filters: AnalyticsPageFilters) {
    this.analytics = await this.service.getAnalytics(filters);
    this.isActivitiesVisible = typeof filters.isActivitiesVisible === 'undefined' ? false : filters.isActivitiesVisible;
    this.isIssuesVisible = typeof filters.isIssuesVisible === 'undefined' ? true : filters.isIssuesVisible;
  }
}

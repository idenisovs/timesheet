import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbCalendarGregorian,
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { AnalyticsViewFilters } from './AnalyticsViewFilterForm';
import { AnalyticsViewService } from './analytics-view.service';
import { AnalyticsViewFilterComponent } from './analytics-view-filter/analytics-view-filter.component';
import { AnalyticsViewTabsComponent } from './analytics-view-tabs/analytics-view-tabs.component';
import { Analytics } from './types';

@Component({
    selector: 'app-analytics-view',
    imports: [
        ReactiveFormsModule,
        AnalyticsViewFilterComponent,
        AnalyticsViewTabsComponent,
    ],
    templateUrl: './analytics-view.component.html',
    styleUrl: './analytics-view.component.scss',
    providers: [
        { provide: NgbCalendar, useClass: NgbCalendarGregorian },
    ]
})
export class AnalyticsViewComponent implements OnInit, OnDestroy {
  analytics?: Analytics;
  isActivitiesVisible: boolean = false;
  isIssuesVisible: boolean = true;

  constructor(
    private service: AnalyticsViewService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  async updateAnalytics(filters: AnalyticsViewFilters) {
    this.analytics = await this.service.getAnalytics(filters);
    this.isActivitiesVisible = typeof filters.isActivitiesVisible === 'undefined' ? false : filters.isActivitiesVisible;
    this.isIssuesVisible = typeof filters.isIssuesVisible === 'undefined' ? true : filters.isIssuesVisible;
  }
}

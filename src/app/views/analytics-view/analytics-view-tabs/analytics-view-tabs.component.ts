import { Component, Input } from '@angular/core';

import { ActivityTreeComponent } from '../activity-tree/activity-tree.component';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { Analytics } from '../types';
import { AnalyticsViewChartsComponent } from '../analytics-view-charts/analytics-view-charts.component';

@Component({
    selector: 'app-analytics-view-tabs',
    imports: [
        ActivityTreeComponent,
        NgbNav,
        NgbNavContent,
        NgbNavLinkButton,
        NgbNavItem,
        NgbNavOutlet,
        AnalyticsViewChartsComponent,
    ],
    templateUrl: './analytics-view-tabs.component.html',
    styleUrl: './analytics-view-tabs.component.scss'
})
export class AnalyticsViewTabsComponent {
  active = 1;

  @Input()
  isActivitiesVisible = false;

  @Input()
  isIssuesVisible = false;

  @Input()
  analytics!: Analytics;
}

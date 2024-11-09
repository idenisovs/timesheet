import { Component, Input } from '@angular/core';

import { ActivityTreeComponent } from '../activity-tree/activity-tree.component';
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { Analytics } from '../types';

@Component({
  selector: 'app-analytics-page-tabs',
  standalone: true,
  imports: [
    ActivityTreeComponent,
    NgbNav,
    NgbNavContent,
    NgbNavLinkButton,
    NgbNavItem,
    NgbNavOutlet,
  ],
  templateUrl: './analytics-page-tabs.component.html',
  styleUrl: './analytics-page-tabs.component.scss',
})
export class AnalyticsPageTabsComponent {
  active = 1;

  @Input()
  isActivitiesVisible = false;

  @Input()
  isIssuesVisible = false;

  @Input()
  analytics!: Analytics;
}

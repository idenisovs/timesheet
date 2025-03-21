import { Component, Input } from '@angular/core';

import { IssueRowComponent } from './issue-row/issue-row.component';
import { ActivityRowComponent } from './activity-row/activity-row.component';
import { ProjectRowComponent } from './project-row/project-row.component';
import { TotalsRowComponent } from './totals-row/totals-row.component';
import { Analytics } from '../types';

@Component({
    selector: 'app-activity-tree',
    imports: [
        IssueRowComponent,
        ActivityRowComponent,
        ProjectRowComponent,
        TotalsRowComponent,
    ],
    templateUrl: './activity-tree.component.html',
    styleUrl: './activity-tree.component.scss'
})
export class ActivityTreeComponent {
  @Input()
  analytics!: Analytics;

  @Input()
  isActivitiesVisible!: boolean;

  @Input()
  isIssuesVisible!: boolean;
}

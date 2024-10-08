import { Component, Input } from '@angular/core';
import { KeyValuePipe, NgForOf, PercentPipe } from '@angular/common';

import { ProjectOverview } from '../../../dto';
import { IssueRowComponent } from './issue-row/issue-row.component';
import { ActivityRowComponent } from './activity-row/activity-row.component';

@Component({
  selector: 'app-activity-tree',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf,
    PercentPipe,
    IssueRowComponent,
    ActivityRowComponent,
  ],
  templateUrl: './activity-tree.component.html',
  styleUrl: './activity-tree.component.scss'
})
export class ActivityTreeComponent {
  @Input()
  activityTree!: ProjectOverview[];
}

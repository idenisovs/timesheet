import { Component, Input, OnInit } from '@angular/core';
import { KeyValuePipe, NgForOf, PercentPipe } from '@angular/common';

import { ProjectOverview } from '../../../dto';
import { IssueRowComponent } from './issue-row/issue-row.component';
import { ActivityRowComponent } from './activity-row/activity-row.component';
import { ProjectRowComponent } from './project-row/project-row.component';
import { Totals } from '../types';
import { DurationService } from '../../../services/duration.service';
import { TotalsRowComponent } from './totals-row/totals-row.component';

@Component({
  selector: 'app-activity-tree',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf,
    PercentPipe,
    IssueRowComponent,
    ActivityRowComponent,
    ProjectRowComponent,
    TotalsRowComponent,
  ],
  templateUrl: './activity-tree.component.html',
  styleUrl: './activity-tree.component.scss'
})
export class ActivityTreeComponent implements OnInit {
  @Input()
  activityTree: ProjectOverview[] = [];

  @Input()
  isActivitiesVisible!: boolean;

  @Input()
  isIssuesVisible!: boolean;

  totals: Totals = {
    activities: 0,
    time: '0',
    rate: 0
  }

  constructor(
    private durationService: DurationService
  ) {}

  ngOnInit() {
    this.calculateTotals();
  }

  calculateTotals() {
    this.totals = this.activityTree.reduce((result: Totals, projectOverview: ProjectOverview) => {
      result.activities += projectOverview.activities.length;
      result.time = this.durationService.sum([result.time, projectOverview.duration]);
      result.rate += projectOverview.durationRatio;
      return result;
    }, { activities: 0, time: '0', rate: 0 });
  }
}

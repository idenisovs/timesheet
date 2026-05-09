import { Component, inject, Input, OnInit } from '@angular/core';
import { DatePipe, PercentPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Overview, Week } from '../../../../entities';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';
import { OverviewService } from '../../../../services/overview.service';
import { ActivitiesRepositoryService } from '../../../../repository/activities-repository.service';
import { WORK_WEEK } from '../../../../constants';

@Component({
    selector: 'app-weekly-overview-modal',
    imports: [
    DatePipe,
    PercentPipe,
    IssueOverviewComponent
],
    templateUrl: './weekly-overview-modal.component.html',
    styleUrl: './weekly-overview-modal.component.scss'
})
export class WeeklyOverviewModalComponent implements OnInit {
  protected modal = inject(NgbActiveModal);
  private overviewService = inject(OverviewService);
  private activityRepository = inject(ActivitiesRepositoryService);

  weeklyOverview!: Overview;

  @Input()
  week!: Week;

  async ngOnInit() {
    if (!this.week) {
      return;
    }

    const activities = await this.activityRepository.getByWeek(this.week);
    this.weeklyOverview = await this.overviewService.getOverview(activities, WORK_WEEK);
  }
}

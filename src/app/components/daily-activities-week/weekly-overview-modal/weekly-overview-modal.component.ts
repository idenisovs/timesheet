import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, NgForOf, NgIf, PercentPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Overview, Week } from '../../../dto';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';
import { OverviewService } from '../../../services/overview.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { WORK_WEEK } from '../../../constants';

@Component({
    selector: 'app-weekly-overview-modal',
    imports: [
        DatePipe,
        NgForOf,
        NgIf,
        JsonPipe,
        PercentPipe,
        IssueOverviewComponent
    ],
    templateUrl: './weekly-overview-modal.component.html',
    styleUrl: './weekly-overview-modal.component.scss'
})
export class WeeklyOverviewModalComponent implements OnInit {
  weeklyOverview!: Overview;

  @Input()
  week!: Week;

  constructor(
    public modal: NgbActiveModal,
    private overviewService: OverviewService,
    private activityRepository: ActivitiesRepositoryService
  ) {}

  async ngOnInit() {
    if (!this.week) {
      return;
    }

    const activities = await this.activityRepository.getByWeek(this.week);
    this.weeklyOverview = await this.overviewService.getOverview(activities, WORK_WEEK);
  }
}

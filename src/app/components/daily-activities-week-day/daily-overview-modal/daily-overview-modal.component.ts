import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgIf, PercentPipe } from '@angular/common';
import {
    IssueOverviewComponent
} from '../../daily-activities-week/weekly-overview-modal/issue-overview/issue-overview.component';
import { Day, Overview } from '../../../dto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OverviewService } from '../../../services/overview.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { WORK_DAY } from '../../../constants';

@Component({
  selector: 'app-daily-overview-modal',
  standalone: true,
    imports: [
        DatePipe,
        IssueOverviewComponent,
        NgIf,
        PercentPipe
    ],
  templateUrl: './daily-overview-modal.component.html',
  styleUrl: './daily-overview-modal.component.scss'
})
export class DailyOverviewModalComponent implements OnInit {
  dailyOverview?: Overview;

  @Input()
  day!: Day;

  constructor(
    public modal: NgbActiveModal,
    private overviewService: OverviewService,
    private activityRepository: ActivitiesRepositoryService
  ) {}

  async ngOnInit() {
    const activities = await this.activityRepository.getByDay(this.day);
    this.dailyOverview = await this.overviewService.getOverview(activities, WORK_DAY);
  }
}

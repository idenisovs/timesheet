import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, NgForOf, NgIf, PercentPipe } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Overview, Week } from '../../../dto';
import { WeeklyOverviewModalService } from './weekly-overview-modal.service';
import { IssueOverviewComponent } from './issue-overview/issue-overview.component';

@Component({
  selector: 'app-weekly-overview-modal',
  standalone: true,
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
    private weeklyOverviewService: WeeklyOverviewModalService
  ) {}

  async ngOnInit() {
    if (!this.week) {
      return;
    }

    this.weeklyOverview = await this.weeklyOverviewService.run(this.week);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Week } from '../../../dto';
import { WeeklyOverviewModalService } from './weekly-overview-modal.service';
import { IssueOverview } from './IssueOverview';

@Component({
  selector: 'app-weekly-overview-modal',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './weekly-overview-modal.component.html',
  styleUrl: './weekly-overview-modal.component.scss'
})
export class WeeklyOverviewModalComponent implements OnInit {
  weeklyOverview: IssueOverview[] = [];

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

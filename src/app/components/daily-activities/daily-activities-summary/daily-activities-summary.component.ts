import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Sheet } from '../../../dto';
import { DailyActivitiesSummary } from './DailyActivitiesSummary';
import { DailyActivitiesSummaryService } from './daily-activities-summary.service';

@Component({
  selector: 'app-daily-activities-summary',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NgForOf,
    DatePipe,
    NgClass
  ],
  templateUrl: './daily-activities-summary.component.html',
  styleUrl: './daily-activities-summary.component.scss'
})
export class DailyActivitiesSummaryComponent implements OnInit {
  @Input()
  sheet?: Sheet;

  summary?: DailyActivitiesSummary;

  constructor(
    public activeModal: NgbActiveModal,
    private summaryService: DailyActivitiesSummaryService
  ) {}

  ngOnInit() {
    if (!this.sheet) {
      return;
    }

    this.summary = this.summaryService.build(this.sheet)
  }
}

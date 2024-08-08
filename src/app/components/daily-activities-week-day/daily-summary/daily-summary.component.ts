import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DailySummary } from './DailySummary';
import { DailySummaryService } from './daily-summary.service';
import { Day } from '../../../dto';

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass,
  ],
  templateUrl: './daily-summary.component.html',
  styleUrl: './daily-summary.component.scss'
})
export class DailySummaryComponent implements OnInit {
  summary?: DailySummary;

  @Input()
  day: Day = new Day();

  constructor(
    public modal: NgbActiveModal,
    private service: DailySummaryService
  ) {}

  ngOnInit() {
    this.service.buildSummary(this.day).then((summary: DailySummary) => {
      this.summary = summary;
    });
  }
}

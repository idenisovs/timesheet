import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Day } from '../../../../../entities';
import { DailyOverviewModalComponent } from '../daily-overview-modal/daily-overview-modal.component';

@Component({
  selector: 'app-day-header',
	imports: [
		DatePipe,
	],
  templateUrl: './day-header.component.html',
  styleUrl: './day-header.component.scss'
})
export class DayHeaderComponent {
  @Input()
  day!: Day;

  modal = inject(NgbModal);

  showDailyOverview() {
    const dailyOverviewModal =  this.modal.open(DailyOverviewModalComponent, {
      centered: true,
      size: 'lg'
    });

    const dailySummaryModal = (dailyOverviewModal.componentInstance as DailyOverviewModalComponent)

    dailySummaryModal.day = this.day;
  }
}

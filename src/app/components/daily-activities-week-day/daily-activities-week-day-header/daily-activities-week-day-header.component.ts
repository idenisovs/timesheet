import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Day } from '../../../dto';
import { DailyOverviewModalComponent } from '../daily-overview-modal/daily-overview-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-activities-week-day-header',
	imports: [
		DatePipe,
	],
  templateUrl: './daily-activities-week-day-header.component.html',
  styleUrl: './daily-activities-week-day-header.component.scss'
})
export class DailyActivitiesWeekDayHeaderComponent {
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

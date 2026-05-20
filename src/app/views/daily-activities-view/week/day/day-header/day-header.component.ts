import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

import { Day } from '../../../../../entities';
import { DailyOverviewModalComponent } from '../daily-overview-modal/daily-overview-modal.component';
import { SettingsService } from '../../../../../services/settings.service';

const DAY_RELATED_EMOJIS: Record<string, string> = {
	Monday: '☕',
	Tuesday: '💪',
	Wednesday: '🐪',
	Thursday: '⚡',
	Friday: '🎉',
	Saturday: '🌅',
	Sunday: '😴',
};

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
  private readonly settingsService = inject(SettingsService);

  get DayEmoji(): string | undefined {
	  if (this.settingsService.settings$().isDayEmojisEnabled) {
		  return DAY_RELATED_EMOJIS[this.getDayName()];
	  } else {
		  return undefined;
	  }
  }

  getDayName(): string {
	  return DateTime.fromISO(this.day.date).setLocale('en').toFormat('cccc');
  }

  showDailyOverview() {
    const dailyOverviewModal =  this.modal.open(DailyOverviewModalComponent, {
      centered: true,
      size: 'lg'
    });

    const dailySummaryModal = (dailyOverviewModal.componentInstance as DailyOverviewModalComponent)

    dailySummaryModal.day = this.day;
  }
}

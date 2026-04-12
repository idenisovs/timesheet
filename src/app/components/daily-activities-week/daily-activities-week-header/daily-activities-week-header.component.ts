import { Component, inject, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Day, Week, ActivitySummary } from '../../../entities';
import { DaysService } from '../../../services/days.service';
import { WeeklyOverviewModalComponent } from '../weekly-overview-modal/weekly-overview-modal.component';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-daily-activities-week-header',
	templateUrl: './daily-activities-week-header.component.html',
	styleUrls: ['./daily-activities-week-header.component.scss'],
	imports: [
		DatePipe,
	],
})
export class DailyActivitiesWeekHeaderComponent {
	private daysService = inject(DaysService);
	private modal = inject(NgbModal);

	isMissingDaysVisible = false;

	@Input()
	week = new Week();

	@Input()
	days: Day[] = [];

	@Input()
	summary = new ActivitySummary();

	get MissingDaysButtonLabel(): string {
		if (this.isMissingDaysVisible) {
			return 'Hide missing days';
		} else {
			return 'Show missing days';
		}
	}

	toggleMissingDays() {
		this.isMissingDaysVisible = !this.isMissingDaysVisible;

		if (this.isMissingDaysVisible) {
			this.daysService.addMissingDays(this.week, this.days);
		} else {
			this.daysService.removeMissingDays(this.days);
		}
	}

	displayWeeklyOverview() {
		const weeklyOverviewModalRef = this.modal.open(WeeklyOverviewModalComponent, {
			centered: true,
			size: 'lg',
		});

		const weeklyOverviewModal = (weeklyOverviewModalRef.componentInstance as WeeklyOverviewModalComponent);

		weeklyOverviewModal.week = this.week;
	}
}

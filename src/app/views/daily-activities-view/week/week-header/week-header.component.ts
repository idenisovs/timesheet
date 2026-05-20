import { Component, inject, input, InputSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

import { Day, Week, ActivitySummary } from '../../../../entities';
import { WeeklyOverviewModalComponent } from '../weekly-overview-modal/weekly-overview-modal.component';
import { WeekService } from '../week.service';


@Component({
	selector: 'app-week-header',
	templateUrl: './week-header.component.html',
	styleUrls: ['./week-header.component.scss'],
	imports: [
		DatePipe,
	],
})
export class WeekHeaderComponent {
	private readonly modal = inject(NgbModal);
	private readonly weekService = inject(WeekService);

	public week: InputSignal<Week> = input<Week>(new Week());
	public days: InputSignal<Day[]> = input<Day[]>([]);
	public summary: InputSignal<ActivitySummary> = input<ActivitySummary>(new ActivitySummary());

	getCurrentDayName(): string {
		return DateTime.now().setLocale('en').toFormat('cccc');
	}

	get MissingDaysButtonLabel(): string {
		if (this.weekService.isMissingDaysVisible()) {
			return 'Hide missing days';
		} else {
			return 'Show missing days';
		}
	}

	toggleMissingDays() {
		this.weekService.toggleMissingDaysVisibility();
	}

	displayWeeklyOverview() {
		const weeklyOverviewModalRef = this.modal.open(WeeklyOverviewModalComponent, {
			centered: true,
			size: 'lg',
		});

		const weeklyOverviewModal = (weeklyOverviewModalRef.componentInstance as WeeklyOverviewModalComponent);

		weeklyOverviewModal.week = this.week();
	}
}

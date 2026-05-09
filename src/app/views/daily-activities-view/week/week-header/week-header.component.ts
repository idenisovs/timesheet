import { Component, inject, input, InputSignal, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Day, Week, ActivitySummary } from '../../../../entities';
import { WeeklyOverviewModalComponent } from '../weekly-overview-modal/weekly-overview-modal.component';
import { ScreenService } from '../../../../services/screen.service';


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
	private readonly screenService = inject(ScreenService);

	public week: InputSignal<Week> = input<Week>(new Week());
	public days: InputSignal<Day[]> = input<Day[]>([]);
	public summary: InputSignal<ActivitySummary> = input<ActivitySummary>(new ActivitySummary());

	public missingDaysVisible = output<boolean>();

	protected isMobile = toSignal<boolean>(this.screenService.isMobile$);
	private isMissingDaysVisible = false;

	get MissingDaysButtonLabel(): string {
		if (this.isMissingDaysVisible) {
			return 'Hide missing days';
		} else {
			return 'Show missing days';
		}
	}

	toggleMissingDays() {
		this.isMissingDaysVisible = !this.isMissingDaysVisible;
		this.missingDaysVisible.emit(this.isMissingDaysVisible);
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

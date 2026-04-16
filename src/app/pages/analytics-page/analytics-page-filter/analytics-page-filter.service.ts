import { Injectable } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { endOfMonth } from '../../../utils';
import { Week } from '../../../entities';

@Injectable({
	providedIn: 'root',
})
export class AnalyticsPageFilterService {

	constructor(private calendar: NgbCalendar) {
	}

	getStartOfMonthDate(): NgbDate {
		const today = this.calendar.getToday();
		today.day = 1;
		return today;
	}

	getEndOfMonthDate(): NgbDate {
		const end = endOfMonth();
		const today = this.calendar.getToday();
		today.day = end.getDate();
		return today;
	}

	getDayFromDate(date: string): NgbDate {
		const [year, month, day] = date.split('-').map(Number);
		return new NgbDate(year, month, day);
	}

	getStartAndEndOfWeek(): { startOfWeek: NgbDate, endOfWeek: NgbDate } {
		const week = new Week();
		const startOfWeek = this.getDayFromDate(week.from);
		const endOfWeek = this.getDayFromDate(week.till);
		return { startOfWeek, endOfWeek };
	}

	getStartAndEndOfMonth(): { startOfMonth: NgbDate, endOfMonth: NgbDate } {
		const startOfMonth = this.getStartOfMonthDate();
		const endOfMonth = this.getEndOfMonthDate();
		return { startOfMonth, endOfMonth };
	}
}

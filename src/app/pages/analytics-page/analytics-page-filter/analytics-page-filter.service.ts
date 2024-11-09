import { Injectable } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { endOfMonth } from '../../../utils';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsPageFilterService {

  constructor(private calendar: NgbCalendar) { }

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

  getDayFromDate(date: Date): NgbDate {
    const day = this.calendar.getToday();
    day.year = date.getFullYear();
    day.month = date.getMonth() + 1;
    day.day = date.getDate();
    return day;
  }
}

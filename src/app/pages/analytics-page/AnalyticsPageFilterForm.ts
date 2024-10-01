import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface AnalyticsPageFilterForm {
  dateFrom: NgbDate | null;
  dateTill: NgbDate | null;
}

export class AnalyticsPageFilters {
  from?: Date;
  till?: Date;

  constructor(form: Partial<AnalyticsPageFilterForm>) {
    if (form.dateFrom) {
      this.from = this.toDate(form.dateFrom);
    }

    if (form.dateTill) {
      this.till = this.toDate(form.dateTill, false);
    }
  }

  toDate(date: NgbDate, startOfDay = true): Date {
    const result = new Date(date.year, date.month-1, date.day);

    if (startOfDay) {
      result.setHours(0, 0, 0, 0);
    } else {
      result.setHours(23, 59, 59, 999);
    }

    return result;
  }
}
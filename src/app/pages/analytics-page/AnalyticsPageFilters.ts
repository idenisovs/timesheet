import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface AnalyticsPageFilters {
  dateFrom: NgbDate | null;
  dateTill: NgbDate | null;
}

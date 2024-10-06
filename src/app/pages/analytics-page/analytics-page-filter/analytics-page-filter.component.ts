import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { endOfMonth } from '../../../utils';
import { AnalyticsPageFilterForm, AnalyticsPageFilters } from '../AnalyticsPageFilterForm';

@Component({
  selector: 'app-analytics-page-filter',
  standalone: true,
	imports: [
		NgbInputDatepicker,
		ReactiveFormsModule,
	],
  templateUrl: './analytics-page-filter.component.html',
  styleUrl: './analytics-page-filter.component.scss'
})
export class AnalyticsPageFilterComponent implements OnInit, OnDestroy {
  filtersForm = this.fb.group({
    dateFrom: [this.getStartOfMonthDate()],
    dateTill: [this.getEndOfMonthDate()],
  });

  filtersFormSubscription!: Subscription;

  @Output()
  changes = new EventEmitter<AnalyticsPageFilters>();

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.filtersFormSubscription = this.filtersForm.valueChanges.subscribe((changes) => {
      this.updateFilters(changes);
    });

    this.updateFilters(this.filtersForm.value);
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
  }

  updateFilters(filterChanges: Partial<AnalyticsPageFilterForm>) {
    const filters = new AnalyticsPageFilters(filterChanges);
    this.changes.emit(filters);
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
}

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { endOfMonth } from '../../../utils';
import { AnalyticsPageFilterForm, AnalyticsPageFilters } from '../AnalyticsPageFilterForm';
import { DateFromComponent } from './date-from/date-from.component';
import { DateTillComponent } from './date-till/date-till.component';

@Component({
  selector: 'app-analytics-page-filter',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    ReactiveFormsModule,
    DateFromComponent,
    DateTillComponent,
  ],
  templateUrl: './analytics-page-filter.component.html',
  styleUrl: './analytics-page-filter.component.scss'
})
export class AnalyticsPageFilterComponent implements OnInit, OnDestroy {
  filtersForm = this.setupDefaultFilters();

  filtersFormSubscription!: Subscription;

  @Output()
  changes = new EventEmitter<AnalyticsPageFilters>();

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.loadFilters();
    this.updateFilters(this.filtersForm.value);

    this.filtersFormSubscription = this.filtersForm.valueChanges.subscribe((changes) => {
      this.updateFilters(changes);
    });
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
  }

  loadFilters() {
    const raw = localStorage.getItem('analytics-filters');

    if (!raw) {
      return;
    }

    const filters = JSON.parse(raw);
    const defaultValues = this.getDefaultFilterFormValues();

    for (let [filter, value] of Object.entries(defaultValues)) {
      if (filter in filters) {
        continue;
      }

      filters[filter] = value;
    }

    this.filtersForm.setValue(filters);
  }

  saveFilters() {
    const raw = JSON.stringify(this.filtersForm.value);

    localStorage.setItem('analytics-filters', raw);
  }

  updateFilters(filterChanges: Partial<AnalyticsPageFilterForm>) {
    this.saveFilters();
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

  getDefaultFilterFormValues() {
    return {
      dateFrom: this.getStartOfMonthDate(),
      dateTill: this.getEndOfMonthDate(),
      isIssuesVisible: true,
      isActivitiesVisible: false
    }
  }

  setupDefaultFilters() {
    return this.fb.group({
      dateFrom: [this.getStartOfMonthDate()],
      dateTill: [this.getEndOfMonthDate()],
      isIssuesVisible: [false],
      isActivitiesVisible: [false]
    });
  }

  resetFilters() {
    const defaultValues = this.getDefaultFilterFormValues();
    this.filtersForm.setValue(defaultValues);
  }
}

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
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
  filtersForm = this.fb.group({
    dateFrom: [this.getStartOfMonthDate()],
    dateTill: [this.getEndOfMonthDate()],
    isActivitiesVisible: [false]
  });

  filtersFormSubscription!: Subscription;

  @Output()
  changes = new EventEmitter<AnalyticsPageFilters>();

  get DateFrom(): FormControl {
    return this.filtersForm.controls.dateFrom;
  }

  constructor(
    private fb: FormBuilder,
    private calendar: NgbCalendar
  ) {}

  ngOnInit() {
    this.filtersFormSubscription = this.filtersForm.valueChanges.subscribe((changes) => {
      this.updateFilters(changes);
    });

    this.loadFilters();
    this.updateFilters(this.filtersForm.value);
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
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbInputDatepicker, NgbCalendar, NgbCalendarGregorian, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AnalyticsPageFilterForm, AnalyticsPageFilters } from './AnalyticsPageFilterForm';
import { Activity } from '../../dto';
import { AnalyticsPageService } from './analytics-page.service';
import { endOfMonth } from '../../utils';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    ReactiveFormsModule,
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarGregorian},
  ],
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  filtersForm = this.fb.group({
    dateFrom: [this.getStartOfMonthDate()],
    dateTill: [this.getEndOfMonthDate()],
  });

  filtersFormSubscription!: Subscription;

  analytics: Activity[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AnalyticsPageService,
    private calendar: NgbCalendar
  ) {
  }

  async ngOnInit() {
    this.filtersFormSubscription = this.filtersForm.valueChanges.subscribe((changes) => {
      this.updateFilters(changes);
    });

    await this.updateFilters(this.filtersForm.value);
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
  }

  async updateFilters(filterChanges: Partial<AnalyticsPageFilterForm>) {
    const filters = new AnalyticsPageFilters(filterChanges);
    this.analytics = await this.service.getAnalytics(filters);
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

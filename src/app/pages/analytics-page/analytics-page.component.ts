import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbInputDatepicker, NgbCalendar, NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AnalyticsPageFilters } from './AnalyticsPageFilters';
import { Activity } from '../../dto';
import { AnalyticsPageService } from './analytics-page.service';

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
    dateTill: [this.calendar.getToday()],
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

  async updateFilters(filterChanges: Partial<AnalyticsPageFilters>) {
    this.analytics = await this.service.getAnalytics(filterChanges);
  }

  getStartOfMonthDate() {
    const today = this.calendar.getToday();
    today.day = 1;
    return today;
  }
}

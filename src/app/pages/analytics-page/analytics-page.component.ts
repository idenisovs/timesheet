import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
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
  styleUrl: './analytics-page.component.scss'
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  filtersForm = this.fb.group({
    dateFrom: [new NgbDate(2024, 9, 1)],
    dateTill: [new NgbDate(2024, 9, 14)]
  });

  filtersFormSubscription!: Subscription;

  analytics: Activity[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AnalyticsPageService
  ) {}

  async ngOnInit() {
    this.filtersFormSubscription = this.filtersForm.valueChanges.subscribe((changes) => {
      this.updateFilters(changes);
    });

    await this.updateFilters(this.filtersForm.value);
  }

  ngOnDestroy() {
    this.filtersFormSubscription.unsubscribe();
  }

  async updateFilters(changes: Partial<AnalyticsPageFilters>) {
    this.analytics = await this.service.getAnalytics();
  }
}

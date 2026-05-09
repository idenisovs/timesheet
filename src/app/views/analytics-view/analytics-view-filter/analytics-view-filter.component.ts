import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AnalyticsViewFilterForm, AnalyticsViewFilters } from '../AnalyticsViewFilterForm';
import { DateFromComponent } from './date-from/date-from.component';
import { DateTillComponent } from './date-till/date-till.component';
import { AnalyticsViewFilterService } from './analytics-view-filter.service';

@Component({
	selector: 'app-analytics-view-filter',
	imports: [
		ReactiveFormsModule,
		DateFromComponent,
		DateTillComponent,
	],
	templateUrl: './analytics-view-filter.component.html',
	styleUrl: './analytics-view-filter.component.scss',
})
export class AnalyticsViewFilterComponent implements OnInit, OnDestroy {
	private fb = inject(FormBuilder);
	private service = inject(AnalyticsViewFilterService);

	protected filtersForm = this.setupDefaultFilters();
	protected filtersFormSubscription!: Subscription;
	protected filtersSnapshot: Partial<AnalyticsViewFilterForm> = {};

	@Output()
	changes = new EventEmitter<AnalyticsViewFilters>();

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
		this.filtersSnapshot = filters;
	}

	saveFilters() {
		const raw = JSON.stringify(this.filtersForm.value);

		localStorage.setItem('analytics-filters', raw);
	}

	updateFilters(filterChanges: Partial<AnalyticsViewFilterForm>) {
		if (this.isIssuesVisibilityChanged(filterChanges)) {
			if (!filterChanges.isIssuesVisible && filterChanges.isActivitiesVisible) {
				this.filtersForm.controls.isActivitiesVisible.setValue(false);
				return;
			}
		}

		if (this.isActivitiesVisibilityChanged(filterChanges)) {
			if (!filterChanges.isIssuesVisible && filterChanges.isActivitiesVisible) {
				this.filtersForm.controls.isIssuesVisible.setValue(true);
				return;
			}
		}

		this.filtersSnapshot = filterChanges;
		this.saveFilters();
		const filters = new AnalyticsViewFilters(filterChanges);
		this.changes.emit(filters);
	}

	isIssuesVisibilityChanged(filterChanges: Partial<AnalyticsViewFilterForm>) {
		return filterChanges.isIssuesVisible !== this.filtersSnapshot.isIssuesVisible;
	}

	isActivitiesVisibilityChanged(filterChanges: Partial<AnalyticsViewFilterForm>) {
		return filterChanges.isActivitiesVisible !== this.filtersSnapshot.isActivitiesVisible;
	}

	getDefaultFilterFormValues() {
		return {
			dateFrom: this.service.getStartOfMonthDate(),
			dateTill: this.service.getEndOfMonthDate(),
			isIssuesVisible: true,
			isActivitiesVisible: false,
		};
	}

	setupDefaultFilters() {
		const { startOfMonth, endOfMonth } = this.service.getStartAndEndOfMonth();
		return this.fb.group({
			dateFrom: [startOfMonth],
			dateTill: [endOfMonth],
			isIssuesVisible: [false],
			isActivitiesVisible: [false],
		});
	}

	resetFilters() {
		const defaultValues = this.getDefaultFilterFormValues();
		this.filtersForm.setValue(defaultValues);
	}

	selectCurrentWeek() {
		const { startOfWeek, endOfWeek } = this.service.getStartAndEndOfWeek();
		this.filtersForm.get('dateFrom')?.setValue(startOfWeek);
		this.filtersForm.get('dateTill')?.setValue(endOfWeek);
	}

	selectCurrentMonth() {
		const { startOfMonth, endOfMonth } = this.service.getStartAndEndOfMonth();
		this.filtersForm.get('dateFrom')?.setValue(startOfMonth);
		this.filtersForm.get('dateTill')?.setValue(endOfMonth);
	}
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';

@Component({
	selector: 'app-daily-activity-item',
	templateUrl: './daily-activity-item.component.html',
	styleUrls: ['./daily-activity-item.component.scss'],
	imports: [
		ReactiveFormsModule,
		NgClass,
	]
})
export class DailyActivityItemComponent {
	@Input()
	activityFormItem = this.fb.group({
		id: [''],
		name: [''],
		from: [''],
		till: [''],
		duration: ['']
	});

	@Input()
	activities: ActivityFormGroup[] = [];

	@Input()
	idx = 0;

	@Input()
	isFirst = false;

	@Input()
	isLast = false;

	@Input()
	isMobile = false;

	@Output()
	add = new EventEmitter<void>();

	@Output()
	remove = new EventEmitter<string>();

	@Output()
	save = new EventEmitter<void>();

	get ActivityId(): string {
		return this.activityFormItem.get('id')?.value;
	}

	get isFirstActivity(): boolean {
		return this.isMobile ? this.isLast : this.isFirst;
	}

	get isLastActivity(): boolean {
		return this.isMobile ? this.isFirst : this.isLast;
	}

	constructor(
		private fb: UntypedFormBuilder,
		private service: DailyActivityItemService
	) {
	}

	handleFromChanges() {
		this.service.handleFromChanges(this.activityFormItem);
	}

	handleTillChanges() {
		this.service.handleTillChanges(this.activityFormItem);
	}

	handleDurationChanges() {
		this.service.handleDurationChanges(this.activityFormItem);
	}

	async copyActivityName() {
		const activityName: string | undefined = this.activityFormItem.get('name')?.value;

		if (!activityName) {
			return;
		}

		if (navigator.clipboard) {
			await navigator.clipboard.writeText(activityName);
		}

		sessionStorage.setItem('clipboard', activityName);
	}

	async pasteActivityName() {
		const activityName = sessionStorage.getItem('clipboard');

		if (activityName) {
			this.activityFormItem.get('name')?.setValue(activityName);
		}
	}

	setCurrentTime(field: 'from' | 'till') {
		this.service.setCurrentTime(this.activityFormItem, field);
	}

	setTimeFromPreviousActivity() {
		const previousActivityDirection = this.isMobile ? 1 : -1;
		const previousActivity = this.activities[this.idx + previousActivityDirection];
		const previousTillField = previousActivity.get('till');

		if (!previousTillField) {
			return;
		}

		const formField = this.activityFormItem.get('from');

		if (formField) {
			formField.setValue(previousTillField.value);
			this.handleFromChanges();
		}
	}
}

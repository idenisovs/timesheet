import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
	],
})
export class DailyActivityItemComponent {
	private service = inject(DailyActivityItemService);

	activityFormItem = input.required<ActivityFormGroup>();
	activities = input<ActivityFormGroup[]>([]);
	idx = input(0);
	isFirst = input(false);
	isLast = input(false);
	barPosition = input<'solo' | 'first' | 'middle' | 'last'>('solo');

	add = output<void>();
	remove = output<string>();
	save = output<void>();

	get ActivityId(): string {
		return this.activityFormItem().get('id')?.value ?? '';
	}

	get Color() {
		return this.activityFormItem().get('color')?.value;
	}

	handleFromChanges() {
		this.service.handleFromChanges(this.activityFormItem());
	}

	handleTillChanges() {
		this.service.handleTillChanges(this.activityFormItem());
	}

	handleDurationChanges() {
		this.service.handleDurationChanges(this.activityFormItem());
	}

	async copyActivityName() {
		const activityName: string | null | undefined = this.activityFormItem().get('name')?.value;

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
			this.activityFormItem().get('name')?.setValue(activityName);
			await this.handleNameChanges();
		}
	}

	setCurrentTime(field: 'from' | 'till') {
		this.service.setCurrentTime(this.activityFormItem(), field);
	}

	setTimeFromPreviousActivity() {
		const previousActivity = this.activities()[this.idx() - 1];
		const previousTillField = previousActivity.get('till');

		if (!previousTillField) {
			return;
		}

		const formField = this.activityFormItem().get('from');

		if (formField) {
			formField.setValue(previousTillField.value);
			this.handleFromChanges();
		}
	}

	async handleNameChanges() {
		const name = this.activityFormItem().get('name')?.value;

		if (!name) {
			return;
		}

		const color = await this.service.findColorForName(name);

		if (color) {
			this.activityFormItem().get('color')?.setValue(color);
		}
	}
}

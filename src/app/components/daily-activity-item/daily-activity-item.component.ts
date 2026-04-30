import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../services/colors.service';

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
	private readonly service = inject(DailyActivityItemService);
	private readonly colorsService = inject(ColorsService);

	activityFormItem = input.required<ActivityFormGroup>();
	activities = input<ActivityFormGroup[]>([]);
	idx = input(0);
	isFirst = input(false);
	isLast = input(false);
	barPosition = input<'solo' | 'first' | 'middle' | 'last'>('solo');

	add = output<void>();
	remove = output<string>();
	save = output<void>();

	private defaultName = signal<string>('');
	private previousPrefix = signal<string>('');
	private isColorChangeRequested = signal(false);

	get ActivityId(): string {
		return this.activityFormItem().get('id')?.value ?? '';
	}

	get ActivityName() {
		const result = this.activityFormItem().get('name')?.value ?? '';
		return result.trim();
	}

	set ActivityName(value: string) {
		this.activityFormItem().get('name')?.setValue(value);
	}

	get ActivityColor() {
		return this.activityFormItem().get('color')?.value ?? '';
	}

	set ActivityColor(value: string) {
		this.activityFormItem().get('color')?.setValue(value);
	}

	constructor() {
		effect(() => {
			this.defaultName.set(this.ActivityName);
			const prefix = this.service.getPrefixFromName(this.ActivityName);
			this.previousPrefix.set(prefix ?? '');
			this.isColorChangeRequested.set(this.ActivityName.length === 0);
		});
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
		if (!this.ActivityName) return;

		if (navigator.clipboard) {
			await navigator.clipboard.writeText(this.ActivityName);
		}

		sessionStorage.setItem('clipboard', this.ActivityName);
	}

	async pasteActivityName() {
		const activityName = sessionStorage.getItem('clipboard');

		if (activityName) {
			this.ActivityName = activityName;
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
		const currentPrefix = this.service.getPrefixFromName(this.ActivityName);
		const isPrefixPresented = currentPrefix != null;

		if (!isPrefixPresented && this.previousPrefix().length > 0) {
			this.previousPrefix.set('');
		}

		if (this.ActivityName.length === 0) {
			this.requestColorChange();
			return;
		}

		if (isPrefixPresented) {
			await this.findColorForPrefixChange(currentPrefix);
		} else {
			await this.findColorForNameChange(this.ActivityName);
		}
	}

	async findColorForPrefixChange(currentPrefix: string) {
		if (currentPrefix === this.previousPrefix()) return;

		this.previousPrefix.set(currentPrefix);

		const color = await this.service.findColorForName(this.ActivityName);

		if (color) {
			this.ActivityColor = color;
			this.isColorChangeRequested.set(false);
		} else {
			this.requestColorChange();
		}
	}

	async findColorForNameChange(currentName: string) {
		const color = await this.service.findColorForName(currentName);

		if (color) {
			this.ActivityColor = color;
			this.isColorChangeRequested.set(false); // Allow change color for the future name changes
		} else {
			this.requestColorChange();
		}
	}

	requestColorChange() {
		if (this.isColorChangeRequested()) return;

		this.ActivityColor = this.colorsService.getNextColorHsl();
		this.isColorChangeRequested.set(true);
	}
}

import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
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
export class DailyActivityItemComponent implements OnInit {
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

	private originalName = signal('');
	private originalPrefix = signal('');
	private isColorChanged = signal(false);
	private isColorInherited = signal(false);
	private isColorDefault = signal(true);
	private isEmptyActivity = signal(false);

	get ActivityId(): string {
		return this.activityFormItem().get('id')?.value ?? '';
	}

	get ActivityName() {
		return this.activityFormItem().get('name')?.value ?? '';
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

	get CurrentPrefix(): string {
		return this.service.getPrefixFromName(this.ActivityName);
	}

	constructor() {
		effect(() => {
			this.originalName.set(this.ActivityName);
			this.originalPrefix.set(this.CurrentPrefix);
			this.isEmptyActivity.set(this.ActivityName.length === 0);
			this.isColorDefault.set(true);
			this.isColorChanged.set(false);
		});
	}

	async ngOnInit() {}

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
		if (this.CurrentPrefix.length > 0 && this.CurrentPrefix === this.originalPrefix()) return;

		this.originalPrefix.set(this.CurrentPrefix);

		await this.triggerColorChange();
	}

	async triggerColorChange() {
		if (this.isColorDefault()) {
			console.log('check if unique')
			const isUnique = await this.service.isActivityUnique(this.originalName());
			console.log('isUnique', isUnique)
			this.isColorDefault.set(isUnique);
			this.isColorInherited.set(!isUnique);
		}

		const color = await this.service.findColorForName(this.ActivityName);

		if (color) {
			console.log('inherit color')
			this.ActivityColor = color;
			this.isColorDefault.set(false);
			this.isColorInherited.set(true);
			this.isColorChanged.set(false);
		} else {
			console.log('chnage color')
			this.requestColorChange();
			this.isColorInherited.set(false);
		}
	}

	requestColorChange() {
		if (this.isColorDefault()) {
			console.log('color is default')
			return;
		}

		if (!this.isColorInherited()) {
			console.log('color is not inherited')
			return;
		}

		if (this.isColorChanged()) {
			console.log('color is already changed')
			return;
		}

		this.ActivityColor = this.colorsService.getNextColorHsl();
		this.isColorChanged.set(true);
	}
}

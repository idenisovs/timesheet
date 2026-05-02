import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../services/colors.service';
import { BarPosition } from './color-bar/color-bar.component';
import { ColorBarComponent } from './color-bar/color-bar.component';

@Component({
	selector: 'app-daily-activity-item',
	templateUrl: './daily-activity-item.component.html',
	styleUrls: ['./daily-activity-item.component.scss'],
	imports: [
		ReactiveFormsModule,
		NgClass,
		ColorBarComponent,
	],
	providers: [
		DailyActivityItemService,
	],
})
export class DailyActivityItemComponent {
	private readonly service = inject(DailyActivityItemService);
	private readonly colorsService = inject(ColorsService);

	public activityFormItem = input.required<ActivityFormGroup>();
	public activities = input<ActivityFormGroup[]>([]);
	public idx = input(0);
	public isFirst = input(false);
	public isLast = input(false);
	public barPosition = input<BarPosition>(BarPosition.Solo);

	public add = output<void>();
	public remove = output<string>();
	public save = output<void>();

	private originalName = signal('');
	private originalPrefix = signal('');
	private isColorChanged = signal(false);
	private isOriginalColor = signal(true);
	private isOriginalNameEmpty = computed(() => this.originalName().length === 0);

	protected get ActivityId(): string {
		return this.activityFormItem().get('id')?.value ?? '';
	}

	private get ActivityName() {
		return this.activityFormItem().get('name')?.value ?? '';
	}

	private set ActivityName(value: string) {
		this.activityFormItem().get('name')?.setValue(value);
	}

	protected get ActivityColor() {
		return this.activityFormItem().get('color')?.value ?? '';
	}

	protected set ActivityColor(value: string) {
		this.activityFormItem().get('color')?.setValue(value);
	}

	private get CurrentPrefix(): string {
		return this.service.getPrefixFromName(this.ActivityName);
	}

	constructor() {
		effect(() => {
			this.originalName.set(this.ActivityName);
			this.originalPrefix.set(this.CurrentPrefix);
			this.isOriginalColor.set(true);
			this.isColorChanged.set(false);
		});
	}

	protected handleFromChanges() {
		this.service.handleFromChanges(this.activityFormItem());
	}

	protected handleTillChanges() {
		this.service.handleTillChanges(this.activityFormItem());
	}

	protected handleDurationChanges() {
		this.service.handleDurationChanges(this.activityFormItem());
	}

	protected async copyActivityName() {
		if (!this.ActivityName) return;

		if (navigator.clipboard) {
			await navigator.clipboard.writeText(this.ActivityName);
		}

		sessionStorage.setItem('clipboard', this.ActivityName);
	}

	protected async pasteActivityName() {
		const activityName = sessionStorage.getItem('clipboard');

		if (activityName) {
			this.ActivityName = activityName;
			await this.handleNameChanges();
		}
	}

	protected setCurrentTime(field: 'from' | 'till') {
		this.service.setCurrentTime(this.activityFormItem(), field);
	}

	protected setTimeFromPreviousActivity() {
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

	protected async handleNameChanges() {
		await this.triggerColorChange();
	}

	private async triggerColorChange() {
		const siblingColor = this.service.findColorInActivities(this.activities(), this.ActivityName, this.ActivityId);
		const isSiblingColorPreferred = siblingColor && this.ActivityColor !== siblingColor;

		if (isSiblingColorPreferred) {
			this.siblingBasedColorChange(siblingColor);
			return;
		}

		const isPrefixInUse = this.CurrentPrefix.length || this.originalPrefix().length;

		if (isPrefixInUse) {
			await this.prefixBasedColorChange();
			return;
		}

		await this.nameBasedColorChange();
	}

	private siblingBasedColorChange(siblingColor: string) {
		this.ActivityColor = siblingColor;
		this.originalName.set(this.ActivityName);
		this.isOriginalColor.set(false);
		this.isColorChanged.set(false);
	}

	private async prefixBasedColorChange() {
		if (this.CurrentPrefix === this.originalPrefix()) {
			return;
		}

		this.originalPrefix.set(this.CurrentPrefix);

		const color = await this.findActivityColor();

		if (color) {
			this.isColorChanged.set(false);
			this.ActivityColor = color;
		} else {
			this.isOriginalColor.set(false);
			this.requestColorChange();
		}
	}

	private async nameBasedColorChange() {
		const color = await this.findActivityColor();

		if (color) {
			this.ActivityColor = color;
			this.originalName.set(this.ActivityName);
			this.isOriginalColor.set(false);
			this.isColorChanged.set(false);
			return;
		}

		const isUniqueName = await this.service.isActivityUnique(this.originalName());

		if (!isUniqueName) {
			this.isOriginalColor.set(false);
		}

		this.requestColorChange();
	}

	private requestColorChange() {
		if (this.isOriginalColor()) {
			return;
		}

		if (this.isOriginalNameEmpty()) {
			return;
		}

		if (this.isColorChanged()) {
			return;
		}

		this.ActivityColor = this.colorsService.getNextColorHsl();
		this.isColorChanged.set(true);
	}

	private findActivityColor() {
		return this.service.findColorForName(this.ActivityName);
	}
}

import { Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { BarPosition } from './color-bar/color-bar.component';
import { ColorBarComponent } from './color-bar/color-bar.component';
import { ActivityColorControllerService } from './activity-color-controller.service';
import { ActivityDiagnosticPanelComponent } from './activity-diagnostic-panel/activity-diagnostic-panel.component';

@Component({
	selector: 'app-daily-activity-item',
	templateUrl: './daily-activity-item.component.html',
	styleUrls: ['./daily-activity-item.component.scss'],
	imports: [
		ReactiveFormsModule,
		NgClass,
		ColorBarComponent,
		ActivityDiagnosticPanelComponent,
	],
	providers: [
		DailyActivityItemService,
		ActivityColorControllerService,
	],
})
export class DailyActivityItemComponent {
	private readonly service = inject(DailyActivityItemService);
	protected readonly cc = inject(ActivityColorControllerService);

	public activityFormItem = input.required<ActivityFormGroup>();
	public activities = input<ActivityFormGroup[]>([]);
	public idx = input(0);
	public isFirst = input(false);
	public isLast = input(false);
	public barPosition = input<BarPosition>(BarPosition.Solo);

	public add = output<void>();
	public remove = output<string>();
	public save = output<void>();

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

	constructor() {
		effect(() => {
			const id = this.activityFormItem().get('id')?.value ?? '';
			const name = this.activityFormItem().get('name')?.value ?? '';

			this.cc.setActivity(id, name);
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
		console.log('triggerColorChange');

		const color = await this.cc.getActivityColor(
			this.activities(),
			this.activityFormItem(),
		);

		if (color) {
			this.ActivityColor = color;
		}
	}

	protected readonly BarPosition = BarPosition;
}

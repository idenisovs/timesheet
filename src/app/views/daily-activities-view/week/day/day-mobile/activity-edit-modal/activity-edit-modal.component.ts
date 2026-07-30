import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	NgbActiveModal,
	NgbDropdown, NgbDropdownItem,
	NgbDropdownMenu, NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Activity } from '@entities';
import { ActivityFormGroup } from '../../DailyActivitiesForm';
import { DailyActivityItemService } from '../../daily-activity-item/daily-activity-item.service';
import { ActivityColorControllerService } from '../../daily-activity-item/activity-color-controller.service';
import { AdjacentActivityComponent } from './adjacent-activity/adjacent-activity.component';
import { ActivityNameInputComponent } from './activity-name-input/activity-name-input.component';
import { ActivityTimeInputComponent } from './activity-time-input/activity-time-input.component';
import { ActivityDurationInputComponent } from './activity-duration-input/activity-duration-input.component';

@Component({
	selector: 'app-activity-edit-modal',
	imports: [
		AdjacentActivityComponent,
		ActivityNameInputComponent,
		ActivityTimeInputComponent,
		ActivityDurationInputComponent,
		NgbDropdown,
		NgbDropdownMenu,
		NgbDropdownItem,
		NgbDropdownToggle,
	],
	templateUrl: './activity-edit-modal.component.html',
	styleUrl: './activity-edit-modal.component.scss',
	providers: [
		DailyActivityItemService,
		ActivityColorControllerService,
	],
})
export class ActivityEditModalComponent implements OnInit, OnDestroy {
	private readonly dailyActivityItemService = inject(DailyActivityItemService);
	private readonly colorController = inject(ActivityColorControllerService);
	public readonly modal = inject(NgbActiveModal);

	private formChangesSub!: Subscription;

	get ActivityColor(): string {
		return this.activityFormItem.get('color')?.value ?? '';
	}

	get PreviousTime(): string {
		if (this.previousActivity) {
			return this.previousActivity.till;
		} else {
			return '00:00';
		}
	}

	get NextTime(): string {
		if (this.nextActivity) {
			return this.nextActivity.from;
		} else {
			return '23:59';
		}
	}

	@Input()
	public activity!: Activity;

	@Input()
	public activityFormItem!: ActivityFormGroup;

	@Input()
	public activityFormItems: ActivityFormGroup[] = [];

	@Input()
	public previousActivity?: Activity;

	@Input()
	public nextActivity?: Activity;

	ngOnInit(): void {
		this.activityFormItem.markAsPristine();

		const id = this.activityFormItem.get('id')?.value ?? '';
		const name = this.activityFormItem.get('name')?.value ?? '';

		this.colorController.setActivity(id, name);

		this.formChangesSub = this.activityFormItem.valueChanges.subscribe((value) => {
			if (!this.activityFormItem) {
				return;
			}

			const durationControl = this.activityFormItem.get('duration') as FormControl;

			if (value.from && value.till) {
				this.dailyActivityItemService.recalculateDuration(this.activityFormItem, false);
			} else {
				durationControl.setValue('', { emitEvent: false });
			}
		});

		const nameControl = this.activityFormItem.get('name') as FormControl;

		this.formChangesSub.add(nameControl.valueChanges.subscribe(() => {
			void this.handleNameChanges();
		}));
	}

	private async handleNameChanges(): Promise<void> {
		await this.colorController.updateActivityColor(
			this.activityFormItems,
			this.activityFormItem,
		);
	}

	ngOnDestroy(): void {
		this.formChangesSub.unsubscribe();
	}

	protected save() {
		this.modal.close('save');
	}

	protected cancel() {
		this.modal.dismiss();
	}

	protected remove() {
		this.modal.close('remove');
	}
}

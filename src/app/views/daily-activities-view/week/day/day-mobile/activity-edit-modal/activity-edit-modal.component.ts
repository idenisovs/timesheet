import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';

import { Activity } from '@entities';
import { ActivityFormGroup } from '../../DailyActivitiesForm';
import { DailyActivityItemService } from '../../daily-activity-item/daily-activity-item.service';
import { AdjacentActivityComponent } from './adjacent-activity/adjacent-activity.component';
import { TimePickerModalComponent } from '../../../../../../components/time-picker/time-picker-modal/time-picker-modal.component';

@Component({
	selector: 'app-activity-edit-modal',
	imports: [
		ReactiveFormsModule,
		AdjacentActivityComponent,
	],
	templateUrl: './activity-edit-modal.component.html',
	styleUrl: './activity-edit-modal.component.scss',
	providers: [
		DailyActivityItemService,
	],
})
export class ActivityEditModalComponent implements OnInit, OnDestroy {
	private readonly ngbModal = inject(NgbModal);
	private readonly dailyActivityItemService = inject(DailyActivityItemService);
	public readonly modal = inject(NgbActiveModal);

	private formChangesSub!: Subscription;

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
	public previousActivity?: Activity;

	@Input()
	public nextActivity?: Activity;

	ngOnInit(): void {
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
	}

	ngOnDestroy(): void {
		this.formChangesSub.unsubscribe();
	}

	protected async openTimePicker(field: 'from' | 'till') {
		const ref = this.ngbModal.open(TimePickerModalComponent);
		const formValue = this.activityFormItem.controls[field].value;
		const currentTimeValue = DateTime.now().toFormat('HH:mm');
		ref.componentInstance.time = formValue || currentTimeValue;

		const result = await ref.result.catch(() => null);

		if (result) {
			this.activityFormItem.controls[field].setValue(result);
		}
	}

	protected save() {
		this.modal.close();
	}

	protected cancel() {
		this.modal.dismiss();
	}
}

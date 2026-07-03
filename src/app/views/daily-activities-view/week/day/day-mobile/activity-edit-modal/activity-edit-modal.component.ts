import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

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
export class ActivityEditModalComponent {
	private readonly ngbModal = inject(NgbModal);
	public readonly modal = inject(NgbActiveModal);

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
}

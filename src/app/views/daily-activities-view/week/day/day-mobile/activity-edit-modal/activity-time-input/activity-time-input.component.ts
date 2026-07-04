import { Component, inject, input, InputSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

import { TimePickerModalComponent } from '../../../../../../../components/time-picker/time-picker-modal/time-picker-modal.component';

@Component({
	selector: 'app-activity-time-input',
	imports: [ReactiveFormsModule],
	templateUrl: './activity-time-input.component.html',
	styleUrl: './activity-time-input.component.scss',
})
export class ActivityTimeInputComponent {
	private readonly ngbModal = inject(NgbModal);

	public label: InputSignal<string> = input.required<string>();
	public fieldId: InputSignal<string> = input.required<string>();
	public control: InputSignal<FormControl<string | null>> = input.required<FormControl<string | null>>();

	protected async openTimePicker() {
		const ref = this.ngbModal.open(TimePickerModalComponent);
		const currentTimeValue = DateTime.now().toFormat('HH:mm');
		ref.componentInstance.time = this.control().value || currentTimeValue;

		const result = await ref.result.catch(() => null);

		if (result) {
			this.control().setValue(result);
		}
	}
}

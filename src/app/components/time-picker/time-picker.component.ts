import { Component, inject, model } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TimePickerModalComponent } from './time-picker-modal/time-picker-modal.component';

@Component({
	selector: 'app-time-picker',
	imports: [],
	templateUrl: './time-picker.component.html',
	styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent {
	private readonly modal = inject(NgbModal);

	public readonly time = model('00:00');

	protected async openPicker() {
		const modalRef = this.modal.open(TimePickerModalComponent, {
			centered: true,
			size: 'sm',
		});

		const instance = modalRef.componentInstance as TimePickerModalComponent;
		instance.time = this.time();

		try {
			const result = await modalRef.result;

			if (result) {
				this.time.set(result);
			}
		} catch {
			// Modal dismissed — keep the current value.
		}
	}
}

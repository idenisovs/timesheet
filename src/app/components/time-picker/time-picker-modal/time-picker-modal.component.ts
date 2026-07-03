import { Component, inject, Input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';

import { TimeBeltComponent } from '../time-belt/time-belt.component';

@Component({
	selector: 'app-time-picker-modal',
	imports: [TimeBeltComponent],
	templateUrl: './time-picker-modal.component.html',
	styleUrl: './time-picker-modal.component.scss',
})
export class TimePickerModalComponent {
	public readonly modal = inject(NgbActiveModal);

	protected readonly hoursCount = 24;
	protected readonly minutesCount = 60;

	protected readonly hour = signal(0);
	protected readonly minute = signal(0);

	@Input()
	public set time(value: string) {
		const [hours, minutes] = value.split(':').map(Number);
		this.hour.set(hours);
		this.minute.set(minutes);
	}

	protected onHourPicked(hour: number) {
		this.hour.set(hour);
	}

	protected onMinutePicked(minute: number) {
		this.minute.set(minute);
	}

	protected setNow() {
		const now = DateTime.now();
		this.hour.set(now.hour);
		this.minute.set(now.minute);
	}

	protected confirm() {
		const hours = this.hour().toString().padStart(2, '0');
		const minutes = this.minute().toString().padStart(2, '0');
		this.modal.close(`${hours}:${minutes}`);
	}
}

import { Component, output, signal } from '@angular/core';

import { TimeBeltComponent } from './time-belt/time-belt.component';

@Component({
	selector: 'app-time-picker',
	// imports: [TimeBeltComponent],
	imports: [
		TimeBeltComponent
	],
	templateUrl: './time-picker.component.html',
	styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent {
	protected readonly hoursCount = 24;
	protected readonly minutesCount = 60;

	public readonly timePicked = output<string>();

	private readonly hour = signal(0);
	private readonly minute = signal(0);

	protected onHourPicked(hour: number) {
		this.hour.set(hour);
		this.emitTime();
	}

	protected onMinutePicked(minute: number) {
		this.minute.set(minute);
		this.emitTime();
	}

	private emitTime() {
		const hours = this.hour().toString().padStart(2, '0');
		const minutes = this.minute().toString().padStart(2, '0');
		this.timePicked.emit(`${hours}:${minutes}`);
	}
}

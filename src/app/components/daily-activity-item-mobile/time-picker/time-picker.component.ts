import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-time-picker',
	imports: [
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: './time-picker.component.html',
	styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent {
	@Input()
	control!: FormControl;

	@Output()
	changes = new EventEmitter<void>();

	@ViewChild('timeInput')
	timeInput!: ElementRef<HTMLInputElement>;

	openTimePicker() {
		const el = this.timeInput.nativeElement;
		el.value = ''; // Display current time on Time Picker opening!
		(el as any).showPicker();
	}

	updateTime(e: Event) {
		const el = e.target as HTMLInputElement;
		this.control.setValue(el.value);
		this.changes.emit();
	}
}

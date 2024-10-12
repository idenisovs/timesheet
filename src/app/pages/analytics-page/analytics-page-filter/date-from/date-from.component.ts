import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-from',
  standalone: true,
	imports: [
		FormsModule,
		NgbInputDatepicker,
		ReactiveFormsModule,
	],
  templateUrl: './date-from.component.html',
  styleUrl: './date-from.component.scss'
})
export class DateFromComponent {
  @Input()
  control!: FormControl<NgbDate | null>;
}

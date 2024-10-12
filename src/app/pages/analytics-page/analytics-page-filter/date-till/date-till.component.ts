import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-till',
  standalone: true,
	imports: [
		FormsModule,
		NgbInputDatepicker,
		ReactiveFormsModule,
	],
  templateUrl: './date-till.component.html',
  styleUrl: './date-till.component.scss'
})
export class DateTillComponent {
  @Input()
  control!: FormControl<NgbDate | null>;
}

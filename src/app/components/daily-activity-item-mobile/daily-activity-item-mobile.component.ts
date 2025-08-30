import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TimePickerComponent } from './time-picker/time-picker.component';

@Component({
  selector: 'app-daily-activity-item-mobile',
  imports: [
    ReactiveFormsModule,
    TimePickerComponent,
  ],
  templateUrl: './daily-activity-item-mobile.component.html',
  styleUrl: './daily-activity-item-mobile.component.scss'
})
export class DailyActivityItemMobileComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    start: [''],
    end: ['']
  });
}

import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TimePickerComponent } from './time-picker/time-picker.component';

type ActivityValue = {
  id: string | null;
  name: string | null;
  from: string | null;
  till: string | null;
  duration: string | null;
};

@Component({
  selector: 'app-daily-activity-item-mobile',
  imports: [
    ReactiveFormsModule,
    TimePickerComponent,
  ],
  templateUrl: './daily-activity-item-mobile.component.html',
  styleUrl: './daily-activity-item-mobile.component.scss'
})
export class DailyActivityItemMobileComponent implements OnDestroy{
  fb = inject(FormBuilder);

  @Input()
  activity = this.fb.group<ActivityValue>({
    id: '',
    name: '',
    from: '',
    till: '',
    duration: ''
  });

  activityChangesSub = this.activity.valueChanges.subscribe((changes: Partial<ActivityValue>) => {
  });

  ngOnDestroy() {
    this.activityChangesSub.unsubscribe();
  }
}

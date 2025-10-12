import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TimePickerComponent } from './time-picker/time-picker.component';
import { DailyActivityItemService } from '../daily-activity-item/daily-activity-item.service';

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
  service = inject(DailyActivityItemService);

  @Input()
  activityForm = this.fb.group<ActivityValue>({
    id: '',
    name: '',
    from: '',
    till: '',
    duration: ''
  });

  fromInputChangesSub = this.activityForm.controls.from.valueChanges.subscribe(() => {
    this.service.handleFromChanges(this.activityForm);
  });

  tillInputChangesSub = this.activityForm.controls.till.valueChanges.subscribe(() => {
    this.service.handleTillChanges(this.activityForm);
  });

  ngOnDestroy() {
    this.fromInputChangesSub.unsubscribe();
    this.tillInputChangesSub.unsubscribe();
  }
}

import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

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
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
  templateUrl: './daily-activity-item-mobile.component.html',
  styleUrl: './daily-activity-item-mobile.component.scss'
})
export class DailyActivityItemMobileComponent {
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

  handleFromChanges() {
    this.service.handleFromChanges(this.activityForm);
  }

  handleTillChanges() {
    this.service.handleTillChanges(this.activityForm);
  }
}

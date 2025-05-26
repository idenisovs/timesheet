import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityFormGroup } from '../DailyActivitiesForm';

@Component({
  selector: 'app-daily-activities-week-day-footer',
  imports: [],
  templateUrl: './daily-activities-week-day-footer.component.html',
  styleUrl: './daily-activities-week-day-footer.component.scss'
})
export class DailyActivitiesWeekDayFooterComponent {
  @Input()
  isChanged!: boolean;

  @Input()
  totalDuration!: string;

  @Input()
  activityFormArrayItems!: ActivityFormGroup[];

  @Output()
  reset = new EventEmitter<void>();
}

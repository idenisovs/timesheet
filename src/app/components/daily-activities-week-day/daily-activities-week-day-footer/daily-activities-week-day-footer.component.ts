import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { Activity } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';

@Component({
  selector: 'app-daily-activities-week-day-footer',
  imports: [],
  templateUrl: './daily-activities-week-day-footer.component.html',
  styleUrl: './daily-activities-week-day-footer.component.scss'
})
export class DailyActivitiesWeekDayFooterComponent {
  activitiesService = inject(ActivitiesService);

  @Input()
  activities!: Activity[];

  @Input()
  isChanged!: boolean;

  @Output()
  reset = new EventEmitter<void>();

  get TotalDuration(): string {
    return this.activitiesService.calculateDuration(this.activities);
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { Activity } from '../../../../../entities';
import { ActivitiesService } from '../../../../../services/activities.service';

@Component({
  selector: 'app-day-footer',
  imports: [],
  templateUrl: './day-footer.component.html',
  styleUrl: './day-footer.component.scss'
})
export class DayFooterComponent {
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

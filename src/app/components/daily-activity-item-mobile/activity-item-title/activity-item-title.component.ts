import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-activity-item-title',
  imports: [],
  templateUrl: './activity-item-title.component.html',
  styleUrl: './activity-item-title.component.scss'
})
export class ActivityItemTitleComponent {
  @Input()
  activityName!: string;
}

import { Component, Input } from '@angular/core';
import { KeyValuePipe, NgForOf, PercentPipe } from '@angular/common';

import { ProjectOverview } from '../../../dto';

@Component({
  selector: 'app-activity-tree',
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf,
    PercentPipe,
  ],
  templateUrl: './activity-tree.component.html',
  styleUrl: './activity-tree.component.scss'
})
export class ActivityTreeComponent {
  @Input()
  activityTree!: ProjectOverview[];
}

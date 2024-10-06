import { Component, Input } from '@angular/core';
import { KeyValuePipe, NgForOf } from '@angular/common';

import { ActivityTree } from '../types';

@Component({
  selector: 'app-activity-tree',
  standalone: true,
	imports: [
		KeyValuePipe,
		NgForOf,
	],
  templateUrl: './activity-tree.component.html',
  styleUrl: './activity-tree.component.scss'
})
export class ActivityTreeComponent {
  @Input()
  activityTree!: ActivityTree;
}

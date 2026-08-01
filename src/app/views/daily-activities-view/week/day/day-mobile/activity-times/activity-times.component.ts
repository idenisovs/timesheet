import { Component, computed, input, InputSignal, Signal } from '@angular/core';

import { Activity } from '@entities';
import {
	TimeBadgeComponent
} from '@components/time-badge/time-badge.component';

@Component({
  selector: 'app-activity-times',
	imports: [TimeBadgeComponent],
  templateUrl: './activity-times.component.html',
  styleUrl: './activity-times.component.scss',
})
export class ActivityTimesComponent {
	activity: InputSignal<Activity> = input.required<Activity>();

	from: Signal<string> = computed<string>(() => this.activity().from);
	till: Signal<string> = computed<string>(() => this.activity().till);
	color: Signal<string | undefined> = computed<string | undefined>(() => this.activity().color);
}

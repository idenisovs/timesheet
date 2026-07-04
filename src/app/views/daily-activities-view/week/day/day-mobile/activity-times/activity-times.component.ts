import { Component, computed, input, InputSignal, Signal } from '@angular/core';

import { Activity } from '@entities';
import { DarkerColorDirective } from '@directives/darker-color.directive';
import { SubtleColorDirective } from '@directives/subtle-color.directive';

@Component({
  selector: 'app-activity-times',
  imports: [DarkerColorDirective, SubtleColorDirective],
  templateUrl: './activity-times.component.html',
  styleUrl: './activity-times.component.scss',
})
export class ActivityTimesComponent {
	activity: InputSignal<Activity> = input.required<Activity>();

	from: Signal<string> = computed<string>(() => this.activity().from);
	till: Signal<string> = computed<string>(() => this.activity().till);
	color: Signal<string | undefined> = computed<string | undefined>(() => this.activity().color);
}

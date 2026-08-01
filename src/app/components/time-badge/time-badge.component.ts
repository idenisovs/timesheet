import { Component, computed, input } from '@angular/core';
import { DarkerColorDirective } from '@directives/darker-color.directive';
import { SubtleColorDirective } from '@directives/subtle-color.directive';

@Component({
  selector: 'app-time-badge',
	imports: [
		DarkerColorDirective,
		SubtleColorDirective,
	],
  templateUrl: './time-badge.component.html',
  styleUrl: './time-badge.component.scss',
})
export class TimeBadgeComponent {
	time = input<string | undefined>();
	color = input<string | undefined>();

	value = computed(() => this.time() ? this.time() : 'n/a');
}

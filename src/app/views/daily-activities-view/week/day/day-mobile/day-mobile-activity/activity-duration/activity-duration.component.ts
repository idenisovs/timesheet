import { Component, input, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { DarkerColorDirective } from '@directives/darker-color.directive';

@Component({
	selector: 'app-activity-duration',
	imports: [
		DarkerColorDirective,
	],
	templateUrl: './activity-duration.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './activity-duration.component.scss',
})
export class ActivityDurationComponent {
	public duration: InputSignal<string> = input.required<string>();
	public color: InputSignal<string | undefined> = input<string | undefined>(undefined);
}

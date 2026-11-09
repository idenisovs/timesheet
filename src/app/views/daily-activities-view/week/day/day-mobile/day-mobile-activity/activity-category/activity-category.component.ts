import { Component, input, InputSignal, ChangeDetectionStrategy } from '@angular/core';
import { DarkerColorDirective } from '@directives/darker-color.directive';

@Component({
	selector: 'app-activity-category',
	imports: [
		DarkerColorDirective,
	],
	templateUrl: './activity-category.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './activity-category.component.scss',
})
export class ActivityCategoryComponent {
	public name: InputSignal<string> = input.required<string>();
	public color: InputSignal<string | undefined> = input<string | undefined>(undefined);
}

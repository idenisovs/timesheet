import { Component, input, InputSignal } from '@angular/core';
import { DarkerColorDirective } from '@directives/darker-color.directive';

@Component({
	selector: 'app-activity-category',
	imports: [
		DarkerColorDirective,
	],
	templateUrl: './activity-category.component.html',
	styleUrl: './activity-category.component.scss',
})
export class ActivityCategoryComponent {
	public name: InputSignal<string> = input.required<string>();
	public color: InputSignal<string | undefined> = input<string | undefined>(undefined);
}

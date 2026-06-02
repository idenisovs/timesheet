import { Component, computed, input, InputSignal, output } from '@angular/core';
import { Activity } from '../../../../../../entities';
import { ActivityCategoryComponent } from './activity-category/activity-category.component';
import { ActivityDurationComponent } from './activity-duration/activity-duration.component';
import { SubtleColorDirective } from '../../../../../../directives/subtle-color.directive';

@Component({
	selector: 'app-day-mobile-activity',
	imports: [
		ActivityCategoryComponent,
		ActivityDurationComponent,
		SubtleColorDirective,
	],
	templateUrl: './day-mobile-activity.component.html',
	styleUrl: './day-mobile-activity.component.scss',
})
export class DayMobileActivityComponent {
	public activity: InputSignal<Activity> = input.required<Activity>();

	public edit = output<void>();

	protected hasData = computed<boolean>(() => {
		return this.activity().name.length > 0;
	});
}

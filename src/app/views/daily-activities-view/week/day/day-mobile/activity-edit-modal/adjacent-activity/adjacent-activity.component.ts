import { Component, input, InputSignal } from '@angular/core';

import { Activity } from '../../../../../../../entities';

@Component({
	selector: 'app-adjacent-activity',
	imports: [],
	templateUrl: './adjacent-activity.component.html',
	styleUrl: './adjacent-activity.component.scss',
})
export class AdjacentActivityComponent {
	public time: InputSignal<string> = input.required<string>();

	public activity: InputSignal<Activity | undefined> = input<Activity>();

	public fallbackLabel: InputSignal<string> = input.required<string>();
}

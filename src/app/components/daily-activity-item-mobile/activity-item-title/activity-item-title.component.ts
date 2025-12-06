import { Component, Input } from '@angular/core';
import { TopicPipe } from '../../../pipes/topic.pipe';

@Component({
	selector: 'app-activity-item-title',
	imports: [
		TopicPipe
	],
	templateUrl: './activity-item-title.component.html',
	styleUrl: './activity-item-title.component.scss',
})
export class ActivityItemTitleComponent {
	@Input()
	activityName: string = '';
}

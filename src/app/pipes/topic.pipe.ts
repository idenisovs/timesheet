import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'topic'
})
export class TopicPipe implements PipeTransform {
	private static readonly DEFAULT_TOPIC = 'Activity';

	transform(activityName: string): string {
		const idx = activityName.indexOf(':');

		if (idx === -1) {
			return TopicPipe.DEFAULT_TOPIC;
		}

		const topic = activityName.slice(0, idx).trim();

		if (!topic) {
			return TopicPipe.DEFAULT_TOPIC;
		}

		return topic;
	}
}

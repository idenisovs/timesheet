import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'description'
})
export class DescriptionPipe implements PipeTransform {
	transform(activityName: string): string {
		const idx = activityName.indexOf(':');

		if (idx === -1) {
			return activityName;
		}

		const description = activityName.slice(idx + 1, activityName.length).trim();

		return description ?? '';
	}
}

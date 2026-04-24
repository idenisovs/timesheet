import { inject, Injectable } from '@angular/core';

import { Activity, ActivitySummary } from '../entities';
import { DurationService } from './duration.service';

@Injectable({
	providedIn: 'root',
})
export class ActivitiesService {
	private readonly durationService = inject(DurationService);

	public calculateDurationMs(activities: Activity[]): number {
		return activities.reduce<number>((result: number, activity: Activity) => {
			return result + this.durationService.toMs(activity.duration);
		}, 0);
	}

	public calculateDuration(activities: Activity[]): string {
		const durationValues = activities.map(activity => activity.duration);
		return this.durationService.sum(durationValues);
	}

	public getActivitySummary(activities: Activity[]): ActivitySummary {
		const summary = new ActivitySummary();

		summary.activities = activities.length;
		summary.duration = this.calculateDuration(activities);

		return summary;
	}

	public sort(activities: Activity[], reverse = false): Activity[] {
		return [...activities].sort((a, b) => {
			if (!a.from && !b.from) return 0;
			if (!a.from) return reverse ? -1 : 1;
			if (!b.from) return reverse ? 1 : -1;
			return reverse ? b.from.localeCompare(a.from) : a.from.localeCompare(b.from);
		});
	}

	public findOverlappingActivities(activities: Activity[], target: Activity): Activity[] {
		return activities.filter(activity => activity.overlaps(target));
	}
}

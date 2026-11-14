import { inject, Service } from '@angular/core';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import {
	ActivityRepositoryService,
} from '@repository/activity-repository.service';

@Service()
export class GetActivitySnapshotsStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		for (const activity of context.activities.toSave) {
			const existingActivity = await this.activityRepo.getById(activity.id);

			if (existingActivity && existingActivity.equals(activity)) {
				continue;
			}

			context.snapshots.push({
				before: existingActivity ?? null,
				after: activity,
			});
		}

		for (const activity of context.activities.toRemove) {
			context.snapshots.push({
				before: activity,
				after: null,
			});
		}
	}
}

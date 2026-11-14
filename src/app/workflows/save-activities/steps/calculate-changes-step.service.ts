import { inject, Service } from '@angular/core';
import { Change } from '@entities';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';

@Service()
export class CalculateChangesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const activitiesToSave = context.activities.toSave;

		const ids = activitiesToSave.map(activity => activity.id);
		const existingActivities = await this.activityRepo.getByIds(ids);
		const existingActivitiesById = new Map(existingActivities.map(activity => [activity.id, activity]));

		for (const activity of activitiesToSave) {
			const existingActivity = existingActivitiesById.get(activity.id);

			if (existingActivity && existingActivity.equals(activity)) {
				continue;
			}

			const change = new Change({
				entity: 'activity',
				before: existingActivity ?? null,
				after: activity,
			});

			context.changes.push(change);
		}

		for (const activity of context.activities.toRemove) {
			const change = new Change({
				entity: 'activity',
				before: activity,
			});

			context.changes.push(change);
		}
	}

}

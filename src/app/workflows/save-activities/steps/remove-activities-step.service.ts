import { inject, Service } from '@angular/core';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import {
	ActivityRepositoryService
} from '@repository/activity-repository.service';

@Service()
export class RemoveActivitiesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { toRemove: activitiesToRemove } = context.activities;
		const activityIds = activitiesToRemove.map<string>(a => a.id);
		const removableActivities = await this.activityRepo.getByIds(activityIds);
		await this.activityRepo.remove(removableActivities);
	}
}

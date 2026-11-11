import { inject, Service } from '@angular/core';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import {
	ActivitiesRepositoryService
} from '@repository/activities-repository.service';

@Service()
export class GetActivitySnapshotsStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivitiesRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { toSave: activitiesToSave, toRemove: activitiesToRemove } = context.activities;

		const saveIds = activitiesToSave.map(a => a.id);
		context.snapshots.beforeSave = await this.activityRepo.getByIds(saveIds);

		const removeIds = activitiesToRemove.map(a => a.id);
		context.snapshots.beforeRemove = await this.activityRepo.getByIds(removeIds);
	}
}

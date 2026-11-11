import { inject, Service } from '@angular/core';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import {
	ActivityRepositoryService,
} from '@repository/activity-repository.service';
import { Step } from '@workflows/Step';

@Service()
export class SaveActivitiesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { toSave: activitiesToSave } = context.activities;
		await this.activityRepo.save(activitiesToSave);
	}
}

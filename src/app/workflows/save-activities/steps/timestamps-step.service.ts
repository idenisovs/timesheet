import { inject, Service } from '@angular/core';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';

@Service()
export class TimestampsStepService implements Step<SaveActivitiesContext> {
	private readonly repository = inject(ActivityRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		for (const activity of context.activities.toSave) {
			const existing = await this.repository.getById(activity.id);

			if (existing) {
				activity.updatedAt = new Date();
			}
		}
	}
}

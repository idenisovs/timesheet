import { inject, Service } from '@angular/core';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveActivitiesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		for (const snapshot of context.snapshots) {
			if (snapshot.after) {
				await this.activityRepo.save([snapshot.after]);
			} else if (snapshot.before) {
				await this.activityRepo.remove([snapshot.before]);
			}
		}
	}
}

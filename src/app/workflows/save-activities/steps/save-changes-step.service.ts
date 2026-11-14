import { inject, Service } from '@angular/core';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import {
	ActivityRepositoryService,
} from '@repository/activity-repository.service';
import { Step } from '@workflows/Step';
import { Activity } from '@entities';
import {
	ChangeRepositoryService
} from '@repository/change-repository.service';

@Service()
export class SaveChangesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { changes } = context;

		for (const change of changes) {
			if (change.after) {
				await this.activityRepo.save([change.after as Activity]);
			} else {
				await this.activityRepo.remove([change.before as Activity])
			}

			await this.changeRepo.save([change]);
		}
	}
}

import { inject, Service } from '@angular/core';
import { Change } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveActivityChangesStepService implements Step<SaveActivitiesContext> {
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const beforeSave = new Map(context.snapshots.beforeSave.map(activity => [activity.id, activity]));

		const changes = context.activities.toSave.map(activity => new Change({
			entity: 'activity',
			before: beforeSave.get(activity.id) ?? null,
			after: activity,
		}));

		for (const activity of context.snapshots.beforeRemove) {
			changes.push(new Change({
				entity: 'activity',
				before: activity,
				after: null,
			}));
		}

		await this.changeRepo.save(changes);
	}
}

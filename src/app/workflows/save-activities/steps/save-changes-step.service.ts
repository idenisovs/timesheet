import { inject, Service } from '@angular/core';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import { Change } from '@entities';
import {
	ChangeRepositoryService
} from '@repository/change-repository.service';

@Service()
export class SaveChangesStepService implements Step<SaveActivitiesContext> {
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const changes: Change[] = [];

		for (const { before, after } of context.snapshots) {
			const change = new Change({
				entity: 'activity', before, after
			});

			changes.push(change);
		}

		await this.changeRepo.save(changes);
	}
}

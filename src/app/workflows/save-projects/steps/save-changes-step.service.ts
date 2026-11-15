import { inject, Service } from '@angular/core';
import { Change } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveChangesStepService implements Step<SaveProjectsContext> {
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveProjectsContext): Promise<void> {
		console.log('Save Projects: Save Changes');

		const changes: Change[] = [];

		for (const { before, after } of context.snapshots) {
			changes.push(new Change({ entity: 'project', before, after }));
		}

		await this.changeRepo.save(changes);
	}
}

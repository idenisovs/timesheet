import { inject, Service } from '@angular/core';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveProjectsStepService implements Step<SaveProjectsContext> {
	private readonly projectRepo = inject(ProjectRepositoryService);

	async execute(context: SaveProjectsContext): Promise<void> {
		for (const { before, after } of context.snapshots) {
			if (!before && after) {
				await this.projectRepo.create(after);
			} else if (before && after) {
				await this.projectRepo.update(after);
			} else if (before) {
				await this.projectRepo.remove(before);
			}
		}
	}
}

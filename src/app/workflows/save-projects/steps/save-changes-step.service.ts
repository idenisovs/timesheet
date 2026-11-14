import { inject, Service } from '@angular/core';
import { Project } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveChangesStepService implements Step<SaveProjectsContext> {
	private readonly projectRepo = inject(ProjectRepositoryService);
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveProjectsContext): Promise<void> {
		for (const change of context.changes) {
			if (!change.before && change.after) {
				await this.projectRepo.create(change.after as Project);
			} else if (change.before && change.after) {
				await this.projectRepo.update(change.after as Project);
			} else if (change.before) {
				await this.projectRepo.remove(change.before as Project);
			}

			await this.changeRepo.save([change]);
		}
	}
}

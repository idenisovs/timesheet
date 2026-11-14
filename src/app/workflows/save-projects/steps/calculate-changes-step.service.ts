import { inject, Service } from '@angular/core';
import { Change } from '@entities';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { Step } from '@workflows/Step';

@Service()
export class CalculateChangesStepService implements Step<SaveProjectsContext> {
	private readonly projectRepo = inject(ProjectRepositoryService);

	async execute(context: SaveProjectsContext): Promise<void> {
		for (const project of context.projects.toSave) {
			const existingProject = await this.projectRepo.getById(project.id);

			if (existingProject && existingProject.equals(project)) {
				continue;
			}

			context.changes.push(new Change({
				entity: 'project',
				before: existingProject,
				after: project,
			}));
		}

		for (const project of context.projects.toRemove) {
			context.changes.push(new Change({
				entity: 'project',
				before: project,
			}));
		}
	}
}

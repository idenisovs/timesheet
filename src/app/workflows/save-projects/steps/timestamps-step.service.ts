import { inject, Service } from '@angular/core';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { Step } from '@workflows/Step';

@Service()
export class TimestampsStepService implements Step<SaveProjectsContext> {
	private readonly repository = inject(ProjectRepositoryService);

	async execute(context: SaveProjectsContext): Promise<void> {
		for (const project of context.projects.toSave) {
			const existing = await this.repository.getById(project.id);

			if (existing) {
				project.updatedAt = new Date();
			}
		}
	}
}

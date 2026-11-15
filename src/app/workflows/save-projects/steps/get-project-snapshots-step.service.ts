import { inject, Service } from '@angular/core';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveProjectsContext } from '@workflows/save-projects/save-projects-context';
import { Step } from '@workflows/Step';
import { Project } from '@entities';

@Service()
export class GetProjectSnapshotsStepService implements Step<SaveProjectsContext> {
	private readonly projectRepo = inject(ProjectRepositoryService);

	async execute(context: SaveProjectsContext): Promise<void> {
		console.log('Save Projects: Get Project Snapshots');

		for (const project of context.projects.toSave) {
			const existingProject = await this.projectRepo.getById(project.id);

			this.updateTimestamps(project, existingProject);

			context.snapshots.push({ before: existingProject, after: project });
		}

		for (const project of context.projects.toRemove) {
			context.snapshots.push({ before: project, after: null });
		}
	}

	private updateTimestamps(project: Project, existingProject: Project | null) {
		if (!existingProject) {
			project.createdAt = new Date();
		}

		project.updatedAt = new Date();
	}
}

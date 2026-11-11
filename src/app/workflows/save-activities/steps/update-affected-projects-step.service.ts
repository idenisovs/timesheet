import { inject, Service } from '@angular/core';
import { Step } from '@workflows/Step';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import {
	ProjectRepositoryService,
} from '@repository/project-repository.service';

@Service()
export class UpdateAffectedProjectsStepService implements Step<SaveActivitiesContext> {
	private projectRepo = inject(ProjectRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { affectedIssues } = context;
		const projectKeys = new Set(affectedIssues.map(i => i.key.split('-')[0]));
		const projects = await this.projectRepo.getAllByKeys([...projectKeys]);

		for (const project of projects) {
			project.updatedAt = new Date();
			await this.projectRepo.update(project);
		}
	}
}

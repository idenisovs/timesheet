import { inject, Service } from '@angular/core';
import { Step } from '@workflows/Step';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import {
	IssueRepositoryService,
} from '@repository/issue-repository.service';
import {
	ProjectRepositoryService,
} from '@repository/project-repository.service';

@Service()
export class UpdateAffectedProjectsStepService implements Step<SaveActivitiesContext> {
	private issueRepo = inject(IssueRepositoryService);
	private projectRepo = inject(ProjectRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const issues = await this.issueRepo.getByIds(context.affectedIssueIds);
		const projectKeys = new Set(issues.map(i => i.key.split('-')[0]));
		const projects = await this.projectRepo.getAllByKeys([...projectKeys]);

		for (const project of projects) {
			project.updatedAt = new Date();
			await this.projectRepo.update(project);
		}
	}
}

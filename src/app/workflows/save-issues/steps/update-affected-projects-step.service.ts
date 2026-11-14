import { inject, Service } from '@angular/core';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';
import {
	SaveProjectsWorkflowService
} from '@workflows/save-projects/save-projects-workflow.service';

@Service()
export class UpdateAffectedProjectsStepService implements Step<SaveIssuesContext> {
	private readonly projectRepo = inject(ProjectRepositoryService);
	private readonly saveProjectsWorkflow = inject(SaveProjectsWorkflowService);

	async execute(context: SaveIssuesContext): Promise<void> {
		console.log('Save Issues: Update Affected Projects');

		const projectKeys: Set<string> = this.getAffectedProjectKeys(context);

		const affectedProjects = await this.projectRepo.getAllByKeys([...projectKeys]);

		await this.saveProjectsWorkflow.run(affectedProjects, []);
	}

	private getAffectedProjectKeys(context: SaveIssuesContext): Set<string> {
		const projectKeys = new Set<string>();

		for (const { before, after } of context.snapshots) {
			if (before?.key) {
				projectKeys.add(before.ProjectKey);
			}

			if (after?.key) {
				projectKeys.add(after.ProjectKey);
			}
		}

		return projectKeys;
	}
}

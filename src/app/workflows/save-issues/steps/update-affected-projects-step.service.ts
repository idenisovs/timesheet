import { inject, Service } from '@angular/core';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';
import { Issue } from '@entities';

@Service()
export class UpdateAffectedProjectsStepService implements Step<SaveIssuesContext> {
	private readonly projectRepo = inject(ProjectRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		console.log('Save Issues: Update Affected Projects');

		const projectKeys: Set<string> = this.getAffectedProjectKeys(context);

		context.affectedProjects = await this.projectRepo.getAllByKeys([...projectKeys]);

		for (const project of context.affectedProjects) {
			project.updatedAt = new Date();
			await this.projectRepo.update(project);
		}
	}

	private getAffectedProjectKeys(context: SaveIssuesContext): Set<string> {
		const projectKeys = new Set<string>();

		for (const change of context.changes) {
			const before = change.before as Issue | null;
			const after = change.after as Issue | null;

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

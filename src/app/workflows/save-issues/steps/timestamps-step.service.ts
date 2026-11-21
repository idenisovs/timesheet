import { inject, Service } from '@angular/core';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';

@Service()
export class TimestampsStepService implements Step<SaveIssuesContext> {
	private readonly repository = inject(IssueRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		for (const issue of context.issues.toSave) {
			const existing = await this.repository.getById(issue.id);

			if (existing) {
				issue.updatedAt = new Date();
			}
		}
	}
}

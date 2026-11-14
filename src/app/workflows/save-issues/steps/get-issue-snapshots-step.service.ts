import { inject, Service } from '@angular/core';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';

@Service()
export class GetIssueSnapshotsStepService implements Step<SaveIssuesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		for (const issue of context.issues.toSave) {
			const existingIssue = await this.issueRepo.getById(issue.id);

			if (existingIssue && existingIssue.equals(issue)) {
				continue;
			}

			context.snapshots.push({
				before: existingIssue ?? null,
				after: issue,
			});
		}

		for (const issue of context.issues.toRemove) {
			context.snapshots.push({
				before: issue,
				after: null,
			});
		}
	}
}

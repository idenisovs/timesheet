import { inject, Service } from '@angular/core';
import { Change } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';

@Service()
export class CalculateChangesStepService implements Step<SaveIssuesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		console.log('Save Issues: Calculate Changes');

		const issuesToSave = context.issues.toSave;
		const ids = issuesToSave.map(issue => issue.id);
		const existingIssues = await this.issueRepo.getByIds(ids);
		const existingIssuesById = new Map(existingIssues.map(issue => [issue.id, issue]));

		for (const issue of issuesToSave) {
			const existingIssue = existingIssuesById.get(issue.id);

			if (existingIssue && existingIssue.equals(issue)) {
				continue;
			}

			const change = new Change({
				entity: 'issue',
				before: existingIssue ?? null,
				after: issue,
			});

			context.changes.push(change);
		}

		for (const issue of context.issues.toRemove) {
			const change = new Change({
				entity: 'issue',
				before: issue,
			});

			context.changes.push(change);
		}
	}
}

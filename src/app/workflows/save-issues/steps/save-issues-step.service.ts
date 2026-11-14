import { inject, Service } from '@angular/core';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveIssuesStepService implements Step<SaveIssuesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		// ToDo: Save method for Issue Repo
		for (const snapshot of context.snapshots) {
			if (!snapshot.before && snapshot.after) {
				await this.issueRepo.create(snapshot.after);
			} else if (snapshot.before && snapshot.after) {
				await this.issueRepo.update(snapshot.after);
			} else if (snapshot.before) {
				await this.issueRepo.remove(snapshot.before);
			}
		}
	}
}

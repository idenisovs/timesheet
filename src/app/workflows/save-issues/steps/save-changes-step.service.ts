import { inject, Service } from '@angular/core';
import { Issue } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveChangesStepService implements Step<SaveIssuesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		console.log('Save Issues: Save Changes');

		for (const change of context.changes) {
			if (change.after) {
				await this.issueRepo.update(change.after as Issue);
			} else {
				await this.issueRepo.remove(change.before as Issue);
			}

			await this.changeRepo.save([change]);
		}
	}
}

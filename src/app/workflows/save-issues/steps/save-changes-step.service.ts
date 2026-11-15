import { inject, Service } from '@angular/core';
import { Change } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SaveIssuesContext } from '@workflows/save-issues/save-issues-context';
import { Step } from '@workflows/Step';

@Service()
export class SaveChangesStepService implements Step<SaveIssuesContext> {
	private readonly changeRepo = inject(ChangeRepositoryService);

	async execute(context: SaveIssuesContext): Promise<void> {
		console.log('Save Issues: Save Changes');

		const changes: Change[] = [];

		for (const { before, after } of context.snapshots) {
			const change = new Change({ entity: 'issue', before, after });
			changes.push(change);
		}

		await this.changeRepo.save(changes);
	}
}

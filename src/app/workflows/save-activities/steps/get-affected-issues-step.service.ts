import { inject, Service } from '@angular/core';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import {
	IssueRepositoryService
} from '@repository/issue-repository.service';

@Service()
export class GetAffectedIssuesStepService implements Step<SaveActivitiesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const activities = [
			...context.snapshots.beforeSave,
			...context.snapshots.beforeRemove,
			...context.activities.toSave,
			...context.activities.toRemove,
		];

		const affectedIssueIds = new Set<string>();

		for (const activity of activities) {
			if (activity.issueId) {
				affectedIssueIds.add(activity.issueId);
			}
		}

		context.affectedIssues = await this.issueRepo.getByIds([...affectedIssueIds]);
	}
}

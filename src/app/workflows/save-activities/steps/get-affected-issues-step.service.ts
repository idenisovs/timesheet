import { inject, Service } from '@angular/core';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import {
	IssueRepositoryService
} from '@repository/issue-repository.service';
import { Activity, Change } from '@entities';

@Service()
export class GetAffectedIssuesStepService implements Step<SaveActivitiesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const activities = this.getActivities(context.changes);

		const affectedIssueIds = new Set<string>();

		for (const activity of activities) {
			if (activity.issueId) {
				affectedIssueIds.add(activity.issueId);
			}
		}

		context.affectedIssues = await this.issueRepo.getByIds([...affectedIssueIds]);
	}

	private getActivities(changes: Change[]): Activity[] {
		const activities: Activity[] = [];

		for (const change of changes) {
			if (change.before) {
				activities.push(change.before as Activity);
			}

			if (change.after) {
				activities.push(change.after as Activity);
			}
		}

		return activities;
	}
}

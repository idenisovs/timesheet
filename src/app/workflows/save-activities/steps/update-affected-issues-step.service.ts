import { inject, Service } from '@angular/core';
import { Step } from '@workflows/Step';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import {
	ActivityRepositoryService,
} from '@repository/activity-repository.service';
import { ActivitiesService } from '@services/activities.service';
import {
	SaveIssuesWorkflowService
} from '@workflows/save-issues/save-issues-workflow.service';
import {
	IssueRepositoryService
} from '@repository/issue-repository.service';
import { Snapshot } from '@workflows/Snapshot';
import { Activity, Issue } from '@entities';

@Service()
export class UpdateAffectedIssuesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);
	private readonly activityService = inject(ActivitiesService);
	private readonly issueRepo = inject(IssueRepositoryService);
	private readonly saveIssues = inject(SaveIssuesWorkflowService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const affectedIssueKeys = this.getAffectedIssueKeys(context.snapshots);
		const affectedIssues: Issue[] = [];

		for (const issueKey of affectedIssueKeys) {
			const activities = await this.activityRepo.getByIssueKey(issueKey);

			let issue = await this.issueRepo.getByKey(issueKey);

			if (!issue) {
				issue = new Issue();
				issue.key = issueKey;
				issue.name = activities[0].name;
			}

			issue.activities = activities.length;
			issue.duration = this.activityService.calculateDuration(activities);

			affectedIssues.push(issue);
		}

		await this.saveIssues.run(affectedIssues, []);
	}

	private getAffectedIssueKeys(snapshots: Snapshot<Activity>[]): Set<string> {
		const issueKeys = new Set<string>();

		for (const { before, after } of snapshots) {
			const beforeKey = before?.getIssueKey();
			const afterKey = after?.getIssueKey();

			if (beforeKey) {
				issueKeys.add(beforeKey);
			}

			if (afterKey) {
				issueKeys.add(afterKey);
			}
		}

		return issueKeys;
	}
}

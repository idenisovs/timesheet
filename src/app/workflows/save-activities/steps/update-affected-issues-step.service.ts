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
import { Activity } from '@entities';

@Service()
export class UpdateAffectedIssuesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);
	private readonly activityService = inject(ActivitiesService);
	private readonly issueRepo = inject(IssueRepositoryService);
	private readonly saveIssues = inject(SaveIssuesWorkflowService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const affectedIssueIds = this.getAffectedIssueIds(context.snapshots);
		const affectedIssues = await this.issueRepo.getByIds([...affectedIssueIds]);

		for (let issue of affectedIssues) {
			const activities = await this.activityRepo.getByIssueId(issue.id);
			issue.activities = activities.length;
			issue.duration = this.activityService.calculateDuration(activities);
		}

		await this.saveIssues.run(affectedIssues, []);
	}

	private getAffectedIssueIds(snapshots: Snapshot<Activity>[]): Set<string> {
		const issueIds = new Set<string>();

		for (const { before, after } of snapshots) {
			if (before?.issueId) {
				issueIds.add(before.issueId);
			}

			if (after?.issueId) {
				issueIds.add(after.issueId);
			}
		}

		return issueIds;
	}
}

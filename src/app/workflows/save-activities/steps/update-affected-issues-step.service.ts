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

@Service()
export class UpdateAffectedIssuesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivityRepositoryService);
	private readonly activityService = inject(ActivitiesService);
	private readonly saveIssues = inject(SaveIssuesWorkflowService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { affectedIssues } = context;

		for (let issue of affectedIssues) {
			const activities = await this.activityRepo.getByIssueId(issue.id);
			issue.activities = activities.length;
			issue.duration = this.activityService.calculateDuration(activities);
		}

		await this.saveIssues.run(affectedIssues, []);
	}
}

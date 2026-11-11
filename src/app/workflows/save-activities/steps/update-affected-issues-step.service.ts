import { inject, Service } from '@angular/core';
import { Step } from '@workflows/Step';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import {
	IssueRepositoryService,
} from '@repository/issue-repository.service';
import {
	ActivitiesRepositoryService,
} from '@repository/activities-repository.service';
import { ActivitiesService } from '@services/activities.service';

@Service()
export class UpdateAffectedIssuesStepService implements Step<SaveActivitiesContext> {
	private issueRepo = inject(IssueRepositoryService);
	private activityRepo = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const issues = await this.issueRepo.getByIds([...context.affectedIssueIds]);

		for (let issue of issues) {
			const activities = await this.activityRepo.getByIssueId(issue.id);
			issue.activities = activities.length;
			issue.duration = this.activitiesService.calculateDuration(activities);
		}

		await this.issueRepo.bulkUpdate(issues);
	}
}

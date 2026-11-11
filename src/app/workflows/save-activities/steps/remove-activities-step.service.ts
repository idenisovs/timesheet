import { inject, Service } from '@angular/core';
import { SaveActivitiesContext } from '@workflows/save-activities/save-activities-context';
import { Step } from '@workflows/Step';
import {
	ActivitiesRepositoryService
} from '@repository/activities-repository.service';

@Service()
export class RemoveActivitiesStepService implements Step<SaveActivitiesContext> {
	private readonly activityRepo = inject(ActivitiesRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const { activitiesToRemove } = context;
		const activityIds = activitiesToRemove.map<string>(a => a.id);
		const removableActivities = await this.activityRepo.getByIds(activityIds);

		const affectedIssueIds = removableActivities
			.map(a => a.issueId)
			.filter((issueId): issueId is string => Boolean(issueId));

		context.affectedIssueIds = [...context.affectedIssueIds, ...affectedIssueIds];

		await this.activityRepo.remove(removableActivities);
	}
}

import { inject, Injectable } from '@angular/core';
import { Issue } from '@entities';
import { SaveIssuesWorkflowService } from '@workflows/save-issues/save-issues-workflow.service';
import { ActivityRepositoryService } from '@repository/activity-repository.service';

@Injectable({
	providedIn: 'root',
})
export class IssueViewService {
	private readonly saveIssues = inject(SaveIssuesWorkflowService);
	private readonly activityRepository = inject(ActivityRepositoryService);

	async remove(issue: Issue) {
		await this.removeActivities(issue);
		await this.removeIssue(issue);
	}

	private async removeActivities(issue: Issue) {
		const activities = await this.activityRepository.getByIssueKey(issue.key);
		await this.activityRepository.remove(activities);
	}

	private async removeIssue(issue: Issue) {
		await this.saveIssues.run([], [issue]);
	}
}

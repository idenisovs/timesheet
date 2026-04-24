import { inject, Injectable } from '@angular/core';
import { Issue } from '../../entities';
import { IssueRepositoryService } from '../../repository/issue-repository.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

@Injectable({
	providedIn: 'root',
})
export class IssuePageService {
	private readonly issueRepository = inject(IssueRepositoryService);
	private readonly activityRepository = inject(ActivitiesRepositoryService);

	async remove(issue: Issue) {
		await this.removeActivities(issue);
		await this.removeIssue(issue);
	}

	private async removeActivities(issue: Issue) {
		const activities = await this.activityRepository.getByIssueKey(issue.key);
		await this.activityRepository.remove(activities);
	}

	private async removeIssue(issue: Issue) {
		await this.issueRepository.remove(issue);
	}
}

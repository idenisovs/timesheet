import { inject, Injectable } from '@angular/core';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';
import { Activity, Issue } from '../entities';
import { IssueRepositoryService } from '../repository/issue-repository.service';
import { DurationService } from '../services/duration.service';

@Injectable({
	providedIn: 'root',
})
export class RemoveActivitiesWorkflowService {
	private readonly activitiesRepository = inject(ActivitiesRepositoryService);
	private readonly issueRepository = inject(IssueRepositoryService);
	private readonly duration = inject(DurationService);

	public async run(activities: Activity[]) {
		const activityIds = activities.map(activity => activity.id);
		const removableActivities = await this.activitiesRepository.getByIds(activityIds);

		for (const activity of removableActivities) {
			await this.updateAffectedIssue(activity);
		}

		await this.activitiesRepository.remove(removableActivities);
	}

	private async updateAffectedIssue(activity: Activity) {
		const issue = await this.getAffectedIssue(activity);

		if (!issue) {
			return;
		}

		issue.activities--;
		issue.duration = this.recalculateDuration(issue, activity);

		await this.issueRepository.update(issue);
	}

	private async getAffectedIssue(activity: Activity): Promise<Issue | null> {
		if (!activity.isLinkedToIssue() || !activity.issueId) {
			return null;
		}

		let issue = await this.issueRepository.getById(activity.issueId);

		if (issue) {
			return issue;
		}

		const issueKey = activity.getIssueKey() as string;

		if (issueKey) {
			issue = await this.issueRepository.getByKey(issueKey);
		}

		return issue;
	}

	private recalculateDuration(issue: Issue, activity: Activity) {
		const totalDuration = this.duration.toMs(issue.duration);
		const activityDuration = this.duration.toMs(activity.duration);
		const result = totalDuration - activityDuration;
		return this.duration.toStr(result);
	}
}

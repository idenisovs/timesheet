import { inject, Injectable } from '@angular/core';

import { IssueRepositoryService } from '../repository/issue-repository.service';
import { ActivitiesRepositoryService } from '../repository/activities-repository.service';
import { ActivitiesService } from '../services/activities.service';
import { Activity, Issue } from '../entities';
import { ProjectRepositoryService } from '../repository/project-repository.service';

@Injectable({
	providedIn: 'root',
})
export class SaveActivitiesWorkflowService {
	private issueRepository = inject(IssueRepositoryService);
	private activitiesRepository = inject(ActivitiesRepositoryService);
	private activitiesService = inject(ActivitiesService);
	private projectRepo = inject(ProjectRepositoryService);

	public async run(activities: Activity[]) {
		const affectedIssueIds = await this.relink(activities);
		await this.activitiesRepository.save(activities);

		const affectedIssues = await this.getAffectedIssues(affectedIssueIds);
		await this.updateAffectedIssues(affectedIssues);
		await this.updateAffectedProjects(affectedIssues);
	}

	private async relink(activities: Activity[]) {
		const issueIdsBeforeUpdate = activities.map(activity => activity.issueId);

		for (let activity of activities) {
			await this.updateActivityLinks(activity);
		}

		const issueIdsAfterUpdate = activities.map(activity => activity.issueId);

		return [...issueIdsBeforeUpdate, ...issueIdsAfterUpdate];
	}

	private async updateActivityLinks(activity: Activity) {
		await this.processIssueLink(activity);
	}

	private async processIssueLink(activity: Activity): Promise<void> {
		if (!activity.isLinkedToIssue()) {
			return;
		}

		if (!activity.hasIssueKey() && activity.issueId) {
			return this.unlinkIssue(activity);
		}

		if (activity.hasIssueKey() && !activity.issueId) {
			return this.linkActivity(activity);
		}

		const linkedIssue = await this.issueRepository.getByKey(activity.getIssueKey() as string);

		if (!linkedIssue || linkedIssue.id !== activity.issueId) {
			return this.relinkIssue(activity);
		}
	}

	private async relinkIssue(activity: Activity): Promise<void> {
		await this.unlinkIssue(activity);
		await this.linkActivity(activity);
	}

	private async unlinkIssue(activity: Activity): Promise<void> {
		if (!activity.issueId) {
			throw new Error(`Cannot unlink activity ${activity.name}: Missing Issue ID!`);
		}

		delete activity.issueId;
	}

	private async linkActivity(activity: Activity): Promise<void> {
		const issueKey = activity.getIssueKey();

		if (!issueKey) {
			throw new Error(`Cannot link activity ${activity.name}: Missing Issue Key!`);
		}

		const issue = await this.getLinkedIssue(activity);

		activity.issueId = issue.id;
	}

	private async getAffectedIssues(rawIssueIds: (string | undefined)[]): Promise<Issue[]> {
		const filteredIssueIds = rawIssueIds.filter(issueId => !!issueId) as string[];
		const uniqueIssueIds = Array.from(new Set(filteredIssueIds));
		return await this.issueRepository.getByIds(uniqueIssueIds);
	}

	private async updateAffectedIssues(issues: Issue[]): Promise<void> {
		for (let issue of issues) {
			const activities = await this.activitiesRepository.getByIssueId(issue.id);
			issue.activities = activities.length;
			issue.duration = this.activitiesService.calculateDuration(activities);
		}

		await this.issueRepository.bulkUpdate(issues);
	}

	private async updateAffectedProjects(issues: Issue[]): Promise<void> {
		const projectKeys = new Set(issues.map(i => i.key.split('-')[0]));
		const projects = await this.projectRepo.getAllByKeys(Array.from(projectKeys));
		for (const project of projects) {
			project.updatedAt = new Date();
			await this.projectRepo.update(project);
		}
	}

	private async getLinkedIssue(activity: Activity): Promise<Issue> {
		const issueKey = activity.getIssueKey();

		if (!issueKey) {
			throw new Error(`Cannot get linked issue, activity ${activity.name} is missing issue key!`);
		}

		let issue = await this.issueRepository.getByKey(issueKey);

		if (issue) {
			return issue;
		}

		return this.createMissingIssue(activity);
	}

	private createMissingIssue(activity: Activity): Promise<Issue> {
		if (!activity.isLinkedToIssue()) {
			throw new Error(`Activity ${activity.name} cannot be linked to issue!`);
		}

		const issue = new Issue({
			key: activity.getIssueKey() as string,
			name: activity.getShortName(),
		});

		return this.issueRepository.create(issue);
	}
}

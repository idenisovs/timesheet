import { inject, Service } from '@angular/core';
import { Step } from '@workflows/Step';
import {
	SaveActivitiesContext,
} from '@workflows/save-activities/save-activities-context';
import { Activity, Issue } from '@entities';
import {
	IssueRepositoryService,
} from '@repository/issue-repository.service';


@Service()
export class RelinkActivitiesStepService implements Step<SaveActivitiesContext> {
	private readonly issueRepo = inject(IssueRepositoryService);

	async execute(context: SaveActivitiesContext): Promise<void> {
		const {activitiesToSave} = context;

		const issueIdsBeforeUpdate = activitiesToSave.map(activity => activity.issueId);

		for (const activity of activitiesToSave) {
			await this.processActivityIssueLink(activity);
		}

		const issueIdsAfterUpdate = activitiesToSave.map(activity => activity.issueId);

		const affectedIssueIds = [
			...issueIdsBeforeUpdate,
			...issueIdsAfterUpdate,
		].filter((id: string | undefined): id is string => Boolean(id));

		context.affectedIssueIds = [...new Set(affectedIssueIds)];
	}

	private async processActivityIssueLink(activity: Activity): Promise<void> {
		if (!activity.isLinkedToIssue()) {
			return;
		}

		if (!activity.hasIssueKey() && activity.issueId) {
			return this.unlinkActivityFromIssue(activity);
		}

		if (activity.hasIssueKey() && !activity.issueId) {
			return this.linkActivityToIssue(activity);
		}

		const linkedIssue = await this.issueRepo.getByKey(activity.getIssueKey() as string);

		if (!linkedIssue || linkedIssue.id !== activity.issueId) {
			return this.relinkIssue(activity);
		}
	}

	private async unlinkActivityFromIssue(activity: Activity): Promise<void> {
		if (!activity.issueId) {
			throw new Error(`Cannot unlink activity ${activity.name}: Missing Issue ID!`);
		}

		delete activity.issueId;
	}

	private async linkActivityToIssue(activity: Activity): Promise<void> {
		const issueKey = activity.getIssueKey();

		if (!issueKey) {
			throw new Error(`Cannot link activity ${activity.name}: Missing Issue Key!`);
		}

		let issue = await this.getLinkedIssue(activity);

		if (!issue) {
			issue = await this.createMissingIssue(activity);
		}

		activity.issueId = issue.id;
	}

	private async relinkIssue(activity: Activity): Promise<void> {
		await this.unlinkActivityFromIssue(activity);
		await this.linkActivityToIssue(activity);
	}

	private async getLinkedIssue(activity: Activity): Promise<Issue | null> {
		const issueKey = activity.getIssueKey();

		if (!issueKey) {
			throw new Error(`Cannot get linked issue, activity ${activity.name} is missing issue key!`);
		}

		return await this.issueRepo.getByKey(issueKey);
	}

	private createMissingIssue(activity: Activity): Promise<Issue> {
		if (!activity.isLinkedToIssue()) {
			throw new Error(`Activity ${activity.name} cannot be linked to issue!`);
		}

		const issue = new Issue({
			key: activity.getIssueKey() as string,
			name: activity.getShortName(),
		});

		return this.issueRepo.create(issue);
	}
}

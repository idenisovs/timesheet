import { Component, effect, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IssueRemoveButtonComponent } from '../issue-remove-button/issue-remove-button.component';
import { Issue } from '../../../entities';
import { IssuesService } from '../../../services/issues.service';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';

@Component({
	selector: 'app-issues-table',
	imports: [
		DatePipe,
		IssueRemoveButtonComponent,
		RouterLink
	],
	templateUrl: './issues-table.component.html',
	styleUrl: './issues-table.component.scss'
})
export class IssuesTableComponent {
	private readonly issueRepository = inject(IssueRepositoryService);
	private readonly issuesService = inject(IssuesService);
	private readonly activitiesRepository = inject(ActivitiesRepositoryService);

	public issues = input<Issue[]>([]);

	protected issueColorMap = new Map<string, string>();

	constructor() {
		effect(() => {
			for (const issue of this.issues()) {
				this.activitiesRepository.getFirstByIssueId(issue.id).then(activity => {
					this.issueColorMap.set(issue.id, activity?.color ?? 'white');
				});
			}
		});
	}


	protected async remove(issue: Issue) {
		await this.issueRepository.remove(issue);
		const idx = this.issues().indexOf(issue);
		this.issues().splice(idx, 1);
	}

	protected getPenaltyPoints(issue: Issue): string {
		const penaltyPoints = this.issuesService.calculateEstimationScore(issue);

		if (penaltyPoints === null) {
			return '--';
		} else {
			return penaltyPoints.toString();
		}
	}

	protected async getColor(issue: Issue): Promise<string> {
		const activity = await this.activitiesRepository.getFirstByIssueId(issue.id);
		if (activity?.color) {
			return activity.color;
		} else {
			return 'white';
		}
	}
}

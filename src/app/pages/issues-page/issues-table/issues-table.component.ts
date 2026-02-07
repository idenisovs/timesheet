import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { IssueRemoveButtonComponent } from '../issue-remove-button/issue-remove-button.component';
import { Issue } from '../../../dto';
import { IssuesService } from '../../../services/issues.service';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';

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
	private issueRepository = inject(IssueRepositoryService);
	private issuesService = inject(IssuesService);

	@Input()
	issues: Issue[] = [];

	async remove(issue: Issue) {
		await this.issueRepository.remove(issue);
		const idx = this.issues.indexOf(issue);
		this.issues.splice(idx, 1);
	}

	getPenaltyPoints(issue: Issue): string {
		const penaltyPoints = this.issuesService.calculateEstimationScore(issue);

		if (penaltyPoints === null) {
			return '--';
		} else {
			return penaltyPoints.toString();
		}
	}
}

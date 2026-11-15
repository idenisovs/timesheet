import {
	Component,
	effect,
	inject,
	input,
	ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
	IssueRemoveButtonComponent,
} from '../issue-remove-button/issue-remove-button.component';
import { Activity, Issue } from '@entities';
import { IssuesService } from '@services/issues.service';
import {
	SaveIssuesWorkflowService,
} from '@workflows/save-issues/save-issues-workflow.service';
import {
	ActivityRepositoryService,
} from '@repository/activity-repository.service';

@Component({
	selector: 'app-issues-table',
	imports: [
		DatePipe,
		IssueRemoveButtonComponent,
		RouterLink,
	],
	templateUrl: './issues-table.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './issues-table.component.scss',
})
export class IssuesTableComponent {
	private readonly saveIssues = inject(SaveIssuesWorkflowService);
	private readonly issuesService = inject(IssuesService);
	private readonly activityRepo = inject(ActivityRepositoryService);

	public issues = input<Issue[]>([]);

	protected issueColorMap = new Map<string, string>();

	constructor() {
		effect(() => {
			for (const issue of this.issues()) {
				this.activityRepo.getFirstByNamePrefix(issue.key).then((activity: Activity | null) => {
					this.issueColorMap.set(issue.id, activity?.color ?? 'white');
				});
			}
		});
	}


	protected async remove(issue: Issue) {
		await this.saveIssues.run([], [issue]);
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
}

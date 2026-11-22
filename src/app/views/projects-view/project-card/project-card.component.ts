import { ChangeDetectionStrategy, Component, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, PercentPipe } from '@angular/common';

import { Project } from '@entities';
import { IssuesService } from '@services/issues.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';

@Component({
	selector: 'app-project-card',
	imports: [
		RouterLink,
		DatePipe,
		PercentPipe,
	],
	templateUrl: './project-card.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
	private issuesRepo = inject(IssueRepositoryService);
	private issuesService = inject(IssuesService);

	readonly project = input.required<Project>();

	protected readonly summary = resource({
		params: () => this.project().keys,
		loader: async ({ params: keys }) => {
			const requests = keys.map(key => this.issuesRepo.getByKeyPrefix(key));
			const groups = await Promise.all(requests);
			const issues = groups.flat();
			const accuracy = this.issuesService.calculateAverageEstimationScore(issues);

			return {
				issueCount: issues.length,
				duration: this.issuesService.calculateDuration(issues),
				accuracy,
				accuracyRate: accuracy / 1000,
			};
		},
	});
}

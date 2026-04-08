import { Component, effect, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Issue, Project } from '../../../entities';
import { IssuesService } from '../../../services/issues.service';
import { IssueRepositoryService } from '../../../repository/issue-repository.service';

@Component({
	selector: 'app-project-card',
	imports: [
		RouterLink,
		DatePipe,
	],
	templateUrl: './project-card.component.html',
	styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
	private issuesRepo = inject(IssueRepositoryService);
	private issuesService = inject(IssuesService);

	project: InputSignal<Project> = input.required<Project>();

	issues: WritableSignal<Issue[]> = signal<Issue[]>([]);

	totalDuration: string = '';
	averageAccuracy: number = 0;
	averageAccuracyRate: number = 0;

	constructor() {
		effect(() => {
			const keys = this.project().keys;
			for (const key of keys) {
				this.issuesRepo.getByKeyPrefix(key).then((issues: Issue[]) => {
					this.issues.update(prev => [...prev, ...issues]);
				});
			}
		});

		effect(() => {
			const issues = this.issues();
			this.totalDuration = this.issuesService.calculateDuration(issues);
			this.averageAccuracy = this.issuesService.calculateAverageEstimationScore(issues);
			this.averageAccuracyRate = this.averageAccuracy / 1000;
		});
	}
}

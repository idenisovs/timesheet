import { inject, Injectable } from '@angular/core';

import { Issue } from '../dto';
import { HOUR, MINUTE } from '../constants';
import { DurationService } from './duration.service';

@Injectable({
	providedIn: 'root'
})
export class IssuesService {
	private durationService = inject(DurationService);

	sort(issue1: Issue, issue2: Issue) {
		if (issue1.createdAt > issue2.createdAt) {
			return -1;
		}

		if (issue1.createdAt < issue2.createdAt) {
			return 1;
		}

		if (issue1.key > issue2.key) {
			return -1;
		}

		if (issue1.key < issue2.key) {
			return 1;
		}

		return 0;
	}

	calculateDuration(issues: Issue[]): string {
		const issueDurationValues = issues.map(issue => issue.duration);
		return this.durationService.sum(issueDurationValues);
	}

	calculateAverageEstimationScore(issues: Issue[]): number {
		const estimatedIssues = this.countEstimatedIssues(issues);

		if (!estimatedIssues) {
			return 0;
		}

		const estimationScoreTotal = this.sumEstimationScores(issues);

		return Math.round(estimationScoreTotal / estimatedIssues);
	}

	sumEstimationScores(issues: Issue[]): number {
		return issues.reduce((result: number, issue: Issue) => {
			const estimationScore = this.calculateEstimationScore(issue);
			return estimationScore ? result + estimationScore : result;
		}, 0);
	}

	calculateEstimationScore(issue: Issue): number | null {
		if (!issue.estimate || !issue.duration) {
			return null;
		}

		const estimatedMs = this.durationService.toMs(issue.estimate);
		const actualMs = this.durationService.toMs(issue.duration);
		const estimatedMinutes = estimatedMs / HOUR / MINUTE;
		const actualMinutes = actualMs / HOUR / MINUTE;
		const estimationAccuracy = actualMinutes / estimatedMinutes;
		const estimationVariance = Math.abs(estimationAccuracy - 1);

		const strictness = 2.5;
		const maxPoints = 1000;

		const penaltyMultiplier = Math.pow(strictness, estimationVariance);

		return Math.round(maxPoints / penaltyMultiplier);
	}

	countEstimatedIssues(issues: Issue[]): number {
		return issues.reduce((result: number, issue: Issue) => {
			return issue.estimate ? result + 1 : result;
		}, 0);
	}
}

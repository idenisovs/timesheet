import { Injectable } from '@angular/core';

import { Issue } from '../dto';
import { HOUR, MINUTE } from '../constants';
import { DurationService } from './duration.service';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private durationService: DurationService) { }

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

  calculateAverageAccuracy(issues: Issue[]): number {
    const estimatedIssues = this.calculateEstimatedIssues(issues);

    if (!estimatedIssues) {
      return 0;
    }

    const penaltyPoints = this.sumPenaltyPoints(issues);

    return Math.round(penaltyPoints / estimatedIssues);
  }

  sumPenaltyPoints(issues: Issue[]): number {
    return issues.reduce((result: number, issue: Issue) => {
      const penaltyPoints = this.calculatePenaltyPoints(issue);

      if (!penaltyPoints) {
        return result;
      }

      return result + penaltyPoints;
    }, 0);
  }

  calculatePenaltyPoints(issue: Issue): number|null {
    if (!issue.estimate || !issue.duration) {
      return null;
    }

    const estimatedMs = this.durationService.toMs(issue.estimate);
    const actualMs = this.durationService.toMs(issue.duration);
    const estimatedMinutes = estimatedMs / HOUR / MINUTE;
    const actualMinutes = actualMs / HOUR / MINUTE;
    const estimateAccuracy = actualMinutes / estimatedMinutes;
	const estimateVariance = Math.abs(estimateAccuracy - 1);

	const strictness = 2;
    const maxPoints = 1000;

    const penaltyMultiplier = Math.pow(strictness, estimateVariance);

    return Math.round(maxPoints / penaltyMultiplier);
  }

  calculateEstimatedIssues(issues: Issue[]): number {
    return issues.reduce((result: number, issue: Issue) => {
      if (issue.estimate) {
        result++;
      }

      return result;
    }, 0);
  }
}

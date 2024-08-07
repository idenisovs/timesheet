import { Injectable } from '@angular/core';
import parseDuration from 'parse-duration';

import { Issue } from '../dto';
import { duration } from 'yet-another-duration';
import { HOUR } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor() { }

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
    const totalDuration = issues.reduce((result: number, issue: Issue) => {
      const duration = parseDuration(issue.duration);

      if (duration) {
        return result + duration
      }

      return result;
    }, 0);

    const result = duration(totalDuration, {
      units: {
        min: 'minutes'
      }
    }).toString();

    return result || '0';
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
    const estimate = parseDuration(issue.estimate ?? '');
    const duration = parseDuration(issue.duration ?? '');

    if (!estimate || !duration) {
      return null;
    }

    const estimatedHours = estimate / HOUR;
    const actualHours = duration / HOUR;
    const error = Math.abs(estimatedHours - actualHours);

    const scalingFactor = 0.2;
    const power = Math.pow(2, -error * scalingFactor);
    const maxPoints = 1000;
    const points = power * maxPoints;

    return Math.round(points);
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

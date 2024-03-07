import { Component, Input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import parseDuration from 'parse-duration';
import { IssueRemoveButtonComponent } from '../issue-remove-button/issue-remove-button.component';
import { Issue } from '../../../dto';
import { SheetStoreService } from '../../../services/sheet-store.service';
import { HOUR } from '../../../constants';

@Component({
  selector: 'app-issues-table',
  standalone: true,
  imports: [
    DatePipe,
    IssueRemoveButtonComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './issues-table.component.html',
  styleUrl: './issues-table.component.scss'
})
export class IssuesTableComponent {
  @Input()
  issues: Issue[] = [];

  constructor(private sheetStore: SheetStoreService) {}

  async remove(issue: Issue) {
    const db = this.sheetStore.Instance;
    await db.issues.delete(issue.id);

    const idx = this.issues.indexOf(issue);
    this.issues.splice(idx, 1);
  }

  getPenaltyPoints(issue: Issue): string {
    const estimate = parseDuration(issue.estimate ?? '');
    const duration = parseDuration(issue.duration ?? '');

    if (!estimate || !duration) {
      return '--';
    }

    const estimatedHours = estimate / HOUR;
    const actualHours = duration / HOUR;
    const error = Math.abs(estimatedHours - actualHours);

    const scalingFactor = 0.2;
    const power = Math.pow(2, -error * scalingFactor);
    const maxPoints = 1000;
    const points = power * maxPoints;

    return Math.round(points).toString();
  }
}

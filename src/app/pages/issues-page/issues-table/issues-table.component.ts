import { Component, Input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueRemoveButtonComponent } from '../issue-remove-button/issue-remove-button.component';
import { Issue } from '../../../dto';
import { SheetStoreService } from '../../../services/sheet-store.service';
import { IssuesService } from '../../../services/issues.service';

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

  constructor(
    private sheetStore: SheetStoreService,
    private issuesService: IssuesService
  ) {}

  async remove(issue: Issue) {
    const db = this.sheetStore.Instance;
    await db.issues.delete(issue.id);

    const idx = this.issues.indexOf(issue);
    this.issues.splice(idx, 1);
  }

  getPenaltyPoints(issue: Issue): string {
    const penaltyPoints = this.issuesService.calculatePenaltyPoints(issue);

    if (penaltyPoints === null) {
      return '--';
    } else {
      return penaltyPoints.toString();
    }
  }
}

import { Component, Input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueRemoveButtonComponent } from '../issue-remove-button/issue-remove-button.component';
import { Issue } from '../../../dto';
import { SheetStoreService } from '../../../services/sheet-store.service';

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
}

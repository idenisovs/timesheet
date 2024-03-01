import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Issue } from '../../dto';
import { SheetStoreService } from '../../services/sheet-store.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-issues-pages',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    RouterLink,
    NgbTooltip,
  ],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private sheetStore: SheetStoreService) {}

  async ngOnInit() {
    this.issues = await this.sheetStore.loadIssues();
  }

  async remove(issue: Issue) {
    if (confirm('Are you sure want to remove this issue?')) {
      const db = this.sheetStore.Instance;
      await db.issues.delete(issue.id);

      const idx = this.issues.indexOf(issue);
      this.issues.splice(idx, 1);
    }
  }
}

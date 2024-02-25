import { Component, OnInit } from '@angular/core';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Issue } from '../../dto';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-issue-page',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    RouterLink
  ],
  templateUrl: './issue-page.component.html',
  styleUrl: './issue-page.component.scss'
})
export class IssuePageComponent implements OnInit {
  issue?: Issue;
  issueKey?: string;
  isNotFound = false

  constructor(
    private route: ActivatedRoute,
    private sheetStore: SheetStoreService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async ({ issueKey }) => {
      const db = this.sheetStore.Instance;

      const existingIssue = await db.issues.where('key').equals(issueKey).first();

      this.issueKey = issueKey;

      if (existingIssue) {
        this.issue = existingIssue;
      } else {
        this.isNotFound = true;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SheetStoreService } from '../../services/sheet-store.service';
import { Issue } from '../../dto';
import { ActivitiesListComponent } from './activities-list/activities-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';

@Component({
  selector: 'app-issue-page',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    ActivitiesListComponent,
    IssueCardComponent
  ],
  templateUrl: './issue-page.component.html',
  styleUrl: './issue-page.component.scss'
})
export class IssuePageComponent implements OnInit {
  issue?: Issue;
  issueKey!: string;
  isNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sheetStore: SheetStoreService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async ({ issueKey }) => {
      this.issueKey = issueKey;
      await this.loadIssue(issueKey);
    });
  }

  async loadIssue(issueKey: string) {
    const db = this.sheetStore.Instance;
    const existingIssue = await db.issues.where('key').equals(issueKey).first();

    if (existingIssue) {
      this.issue = existingIssue;
    } else {
      this.isNotFound = true;
    }
  }
}

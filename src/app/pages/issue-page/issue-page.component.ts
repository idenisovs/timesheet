import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Activity, Issue } from '../../dto';
import { ActivitiesListComponent } from './activities-list/activities-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';
import { IssueRepositoryService } from '../../repository/issue-repository.service';

@Component({
    selector: 'app-issue-page',
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
  activities: Activity[] = [];
  issueKey!: string;
  isNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private activityRepository: ActivitiesRepositoryService,
    private issueRepository: IssueRepositoryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async ({ issueKey }) => {
      this.issueKey = issueKey;
      await this.loadIssue(issueKey);
    });
  }

  async loadIssue(issueKey: string) {
    const existingIssue = await this.issueRepository.getByKey(issueKey);

    if (existingIssue) {
      this.issue = existingIssue;
      this.activities = await this.activityRepository.getByIssueKey(this.issueKey);
    } else {
      this.isNotFound = true;
    }
  }
}

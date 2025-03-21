import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Issue } from '../../dto';
import { ActionsService } from '../../services/actions.service';
import { Actions } from '../../services/Actions';
import { CreateIssueModalComponent } from './create-issue-modal/create-issue-modal.component';
import { handleModalResult } from '../../utils';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssueRepositoryService } from '../../repository/issue-repository.service';

@Component({
    selector: 'app-issues-pages',
    imports: [
        NgIf,
        IssuesListComponent
    ],
    providers: [DatePipe],
    templateUrl: './issues-page.component.html',
    styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];
  actionsSubscription?: Subscription;
  issuesGroupedByDate = new Map<string, Issue[]>();

  constructor(
    private actionsService: ActionsService,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private issueRepository: IssueRepositoryService
  ) {}

  async ngOnInit() {
    this.issues = await this.issueRepository.getAll();
    this.groupIssuesByDate();
    this.actionsSubscription = this.actionsService.on.subscribe(this.handleActions.bind(this));
  }

  ngOnDestroy() {
    this.actionsSubscription?.unsubscribe();
  }

  groupIssuesByDate() {
    this.issues.forEach((issue: Issue) => {
      const date = this.getDateString(issue.createdAt);

      if (this.issuesGroupedByDate.has(date)) {
        this.issuesGroupedByDate.get(date)?.push(issue);
      } else {
        this.issuesGroupedByDate.set(date, [issue]);
      }
    });
  }

  handleActions(action: Actions) {
    if (action === Actions.CreateIssue) {
      void this.showCreateActionModal();
    }
  }

  async showCreateActionModal() {
    const createIssueModal =  this.modal.open(CreateIssueModalComponent, {
      centered: true
    });

    const createdIssue = await handleModalResult<Issue|null>(createIssueModal.result);

    if (createdIssue) {
      this.appendCreatedIssue(createdIssue);
    }
  }

  appendCreatedIssue(issue: Issue) {
    this.issues.unshift(issue);

    const date = this.getDateString(issue.createdAt);

    if (this.issuesGroupedByDate.has(date)) {
      this.issuesGroupedByDate.get(date)?.unshift(issue);
    } else {
      this.issuesGroupedByDate.set(date, [issue]);
    }
  }

  getDateString(issueDate: Date): string {
    return this.datePipe.transform(issueDate, 'YYYY-MM') as string;
  }
}

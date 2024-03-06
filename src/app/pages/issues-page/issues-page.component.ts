import { RouterLink } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Issue } from '../../dto';
import { SheetStoreService } from '../../services/sheet-store.service';
import { IssueRemoveButtonComponent } from './issue-remove-button/issue-remove-button.component';
import { ActionsService } from '../../services/actions.service';
import { Actions } from '../../services/Actions';
import { CreateIssueModalComponent } from './create-issue-modal/create-issue-modal.component';
import { handleModalResult } from '../../utils';

@Component({
  selector: 'app-issues-pages',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    RouterLink,
    NgbTooltip,
    IssueRemoveButtonComponent
  ],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.scss'
})
export class IssuesPageComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];
  actionsSubscription?: Subscription;

  constructor(
    private sheetStore: SheetStoreService,
    private actionsService: ActionsService,
    private modal: NgbModal
  ) {}

  async ngOnInit() {
    this.issues = await this.sheetStore.loadIssues();
    this.actionsSubscription = this.actionsService.on.subscribe(this.handleActions.bind(this));
  }

  ngOnDestroy() {
    this.actionsSubscription?.unsubscribe();
  }

  async remove(issue: Issue) {
    const db = this.sheetStore.Instance;
    await db.issues.delete(issue.id);

    const idx = this.issues.indexOf(issue);
    this.issues.splice(idx, 1);
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

    const result = await handleModalResult<Issue|null>(createIssueModal.result);

    console.log(result);
  }
}

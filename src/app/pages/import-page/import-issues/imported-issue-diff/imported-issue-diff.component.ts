import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';

import { Issue } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { IssueRepositoryService } from '../../../../repository/issue-repository.service';
import { ImportIssuesService } from '../import-issues.service';

@Component({
    selector: 'app-imported-issue-diff',
    imports: [
        DatePipe,
        NgIf,
        NgClass,
    ],
    templateUrl: './imported-issue-diff.component.html',
    styleUrl: './imported-issue-diff.component.scss'
})
export class ImportedIssueDiffComponent implements OnInit {
  status = DiffStatus.same;
  existingIssue: Issue|null = null;

  @Input()
  importedIssue!: Issue;

  @Output()
  completed = new EventEmitter<Issue>();

  constructor(
    private issuesRepository: IssueRepositoryService,
    private importIssuesService: ImportIssuesService
  ) {}

  async ngOnInit() {
    if (!this.importedIssue) {
      return;
    }

    this.existingIssue = await this.importIssuesService.getExistingIssue(this.importedIssue);
    this.status = this.importIssuesService.getDiffStatus(this.existingIssue, this.importedIssue);

    if (this.status === DiffStatus.same) {
      this.completed.emit(this.importedIssue);
    }
  }

  async save() {
    await this.issuesRepository.create(this.importedIssue);
    this.status = DiffStatus.same;
    this.completed.emit(this.importedIssue);
  }

  async update() {
    if (!this.existingIssue) {
      return;
    }

    this.importedIssue.id = this.existingIssue.id;
    await this.issuesRepository.update(this.importedIssue);
    this.completed.emit(this.importedIssue);
  }

  async cancel() {
    this.completed.emit(this.importedIssue);
  }

  getRowStyle() {
    switch (this.status) {
      case DiffStatus.new:
        return 'text-primary';
      case DiffStatus.updated:
        return 'text-success';
      default:
        return '';
    }
  }

  protected readonly DiffStatus = DiffStatus;
}

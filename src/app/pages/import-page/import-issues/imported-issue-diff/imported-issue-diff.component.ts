import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';

import { Issue } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { IssueRepositoryService } from '../../../../repository/issue-repository.service';

@Component({
  selector: 'app-imported-issue-diff',
  standalone: true,
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
    private issuesRepository: IssueRepositoryService
  ) {}

  async ngOnInit() {
    if (!this.importedIssue) {
      return;
    }

    this.existingIssue = await this.getExistingIssue();
    this.status = this.getDiffStatus();

    if (this.status === DiffStatus.same) {
      this.completed.emit(this.importedIssue);
    }
  }

  async getExistingIssue(): Promise<Issue|null> {
    let existingIssue = await this.issuesRepository.getById(this.importedIssue.id);

    if (existingIssue) {
      return existingIssue;
    }

    return this.issuesRepository.getByKey(this.importedIssue.key);
  }

  getDiffStatus(): DiffStatus {
    if (!this.existingIssue) {
      return DiffStatus.new;
    }

    if (!this.existingIssue.equals(this.importedIssue)) {
      return DiffStatus.updated;
    }

    return DiffStatus.same;
  }

  async save() {
    await this.issuesRepository.create(this.importedIssue);
    this.status = DiffStatus.same;
    this.completed.emit(this.importedIssue);
  }

  async update() {
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

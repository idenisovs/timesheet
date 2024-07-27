import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Issue } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { IssueRepositoryService } from '../../../../repository/issue-repository.service';

@Component({
  selector: 'app-imported-issue-diff',
  standalone: true,
  imports: [],
  templateUrl: './imported-issue-diff.component.html',
  styleUrl: './imported-issue-diff.component.scss'
})
export class ImportedIssueDiffComponent implements OnInit {
  status = DiffStatus.same;
  existingIssue: Issue|null = null;

  @Input() importedIssue!: Issue;

  @Output() completed = new EventEmitter<Issue>();

  constructor(
    private issuesRepository: IssueRepositoryService
  ) {}

  async ngOnInit() {
    console.log(this.importedIssue);
    if (!this.importedIssue) {
      return;
    }

    this.existingIssue = await this.issuesRepository.getById(this.importedIssue.id);

    console.log(this.existingIssue);
  }
}

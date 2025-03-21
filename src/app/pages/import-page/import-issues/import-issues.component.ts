import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

import { Issue } from '../../../dto';
import { ImportedProjectDiffComponent } from '../import-projects/imported-project-diff/imported-project-diff.component';
import { ImportedIssueDiffComponent } from './imported-issue-diff/imported-issue-diff.component';
import {IssueRepositoryService} from "../../../repository/issue-repository.service";
import { ImportIssuesService } from './import-issues.service';

@Component({
    selector: 'app-import-issues',
    imports: [
        ImportedProjectDiffComponent,
        NgForOf,
        ImportedIssueDiffComponent,
    ],
    templateUrl: './import-issues.component.html',
    styleUrl: './import-issues.component.scss'
})
export class ImportIssuesComponent {
  @Input()
  importedIssues: Issue[] = [];

  constructor(
    private issueRepo: IssueRepositoryService,
    private importIssuesService: ImportIssuesService
  ) {}

  removeCompletedIssue(issue: Issue) {
    const idx = this.importedIssues.indexOf(issue);
    this.importedIssues.splice(idx, 1);
  }

  async saveAll() {
    let importedIssuesCount = 0;

    for (let idx = 0; idx < this.importedIssues.length; idx++) {
      const importedIssue = this.importedIssues[idx];
      const existingIssue = await this.importIssuesService.getExistingIssue(importedIssue);

      if (existingIssue) {
        importedIssue.id = existingIssue.id;
        await this.issueRepo.update(importedIssue);
      } else {
        await this.issueRepo.create(importedIssue);
      }

      this.importedIssues.splice(idx, 1);
      idx--;
      importedIssuesCount++;
    }
  }

  async saveNew() {
    let importedIssuesCount = 0;

    for (let idx = 0; idx < this.importedIssues.length; idx++) {
      const importedIssue = this.importedIssues[idx];

      const existingIssue = await this.issueRepo.getById(importedIssue.id);

      if (existingIssue) {
        continue;
      }

      await this.issueRepo.create(importedIssue);
      this.importedIssues.splice(idx, 1);
      idx--;
      importedIssuesCount++;
    }

    alert(`Imported ${importedIssuesCount} issues!`);
  }

  cancel() {
    this.importedIssues.splice(0);
  }
}

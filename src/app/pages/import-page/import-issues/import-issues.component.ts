import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

import { Issue } from '../../../dto';
import { ImportedProjectDiffComponent } from '../import-projects/imported-project-diff/imported-project-diff.component';
import { ImportedIssueDiffComponent } from './imported-issue-diff/imported-issue-diff.component';

@Component({
  selector: 'app-import-issues',
  standalone: true,
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

  removeCompletedIssue(issue: Issue) {
    const idx = this.importedIssues.indexOf(issue);
    this.importedIssues.splice(idx, 1);
  }
}

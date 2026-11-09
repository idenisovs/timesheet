import { Component, Input, ChangeDetectionStrategy } from '@angular/core';


import { IssuesTableComponent } from '../../issues-view/issues-table/issues-table.component';
import { Issue } from '@entities';

@Component({
    selector: 'app-project-issues',
    imports: [
    IssuesTableComponent
],
    templateUrl: './project-issues.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './project-issues.component.scss'
})
export class ProjectIssuesComponent {
  @Input()
  issues: Issue[] = [];
}

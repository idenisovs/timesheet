import { Component, Input } from '@angular/core';


import { IssuesTableComponent } from '../../issues-page/issues-table/issues-table.component';
import { Issue } from '../../../dto';

@Component({
    selector: 'app-project-issues',
    imports: [
    IssuesTableComponent
],
    templateUrl: './project-issues.component.html',
    styleUrl: './project-issues.component.scss'
})
export class ProjectIssuesComponent {
  @Input()
  issues: Issue[] = [];
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { IssueRemoveButtonComponent } from '../issue-remove-button/issue-remove-button.component';
import { RouterLink } from '@angular/router';
import { Issue } from '../../../dto';

@Component({
  selector: 'app-issues-table',
  standalone: true,
  imports: [
    DatePipe,
    IssueRemoveButtonComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './issues-table.component.html',
  styleUrl: './issues-table.component.scss'
})
export class IssuesTableComponent {
  @Input()
  issues: Issue[] = [];

  @Output()
  remove = new EventEmitter<Issue>();
}

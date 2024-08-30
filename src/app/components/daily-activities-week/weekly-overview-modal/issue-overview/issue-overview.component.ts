import { Component, Input } from '@angular/core';
import { IssueOverview } from '../IssueOverview';
import { NgForOf, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-issue-overview',
  standalone: true,
  imports: [
    NgForOf,
    PercentPipe
  ],
  templateUrl: './issue-overview.component.html',
  styleUrl: './issue-overview.component.scss'
})
export class IssueOverviewComponent {
  @Input()
  issueOverview!: IssueOverview;
}

import { Component, Input } from '@angular/core';
import { NgForOf, PercentPipe } from '@angular/common';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

import { IssueOverview } from '../../../../dto';

@Component({
    selector: 'app-issue-overview',
    imports: [
        NgForOf,
        PercentPipe,
        NgbCollapse
    ],
    templateUrl: './issue-overview.component.html',
    styleUrl: './issue-overview.component.scss'
})
export class IssueOverviewComponent {
  @Input()
  issueOverview!: IssueOverview;
  isActivityListCollapsed = true;
}

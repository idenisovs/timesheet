import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IssueOverview } from '../../../../dto';
import { DatePipe, PercentPipe } from '@angular/common';

@Component({
    selector: '[app-issue-row]',
    imports: [
        PercentPipe,
        DatePipe,
    ],
    templateUrl: './issue-row.component.html',
    styleUrl: './issue-row.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueRowComponent {
  @Input()
  issueOverview!: IssueOverview;
}

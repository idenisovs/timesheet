import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IssueOverview } from '../../../../dto';
import { PercentPipe } from '@angular/common';

@Component({
  selector: '[app-issue-row]',
  standalone: true,
  imports: [
    PercentPipe,
  ],
  templateUrl: './issue-row.component.html',
  styleUrl: './issue-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueRowComponent {
  @Input()
  issueOverview!: IssueOverview;
}

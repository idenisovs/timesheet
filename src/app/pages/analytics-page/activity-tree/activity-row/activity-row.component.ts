import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivityOverview } from '../../../../dto';
import { PercentPipe } from '@angular/common';

@Component({
  selector: '[app-activity-row]',
  standalone: true,
  imports: [
    PercentPipe,
  ],
  templateUrl: './activity-row.component.html',
  styleUrl: './activity-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityRowComponent {
  @Input()
  activityOverview!: ActivityOverview;
}

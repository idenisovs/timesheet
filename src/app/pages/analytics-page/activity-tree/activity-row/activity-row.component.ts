import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity, ActivityOverview } from '../../../../dto';
import { DatePipe, PercentPipe } from '@angular/common';

@Component({
  selector: '[app-activity-row]',
  standalone: true,
  imports: [
    PercentPipe,
    DatePipe,
  ],
  templateUrl: './activity-row.component.html',
  styleUrl: './activity-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityRowComponent {
  get CreatedAt(): Date {
    return this.activityOverview.activities.reduce<Date>((date: Date, activity: Activity) => {
      return activity.date < date ? activity.date : date;
    }, new Date());
  }

  @Input()
  activityOverview!: ActivityOverview;
}

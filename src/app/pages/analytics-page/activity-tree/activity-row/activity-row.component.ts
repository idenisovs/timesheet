import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, PercentPipe } from '@angular/common';
import { Activity, ActivityOverview } from '../../../../entities';
import { getCurrentDateIso } from '../../../../utils/date-v2';

@Component({
	selector: '[app-activity-row]',
	imports: [
		PercentPipe,
		DatePipe,
	],
	templateUrl: './activity-row.component.html',
	styleUrl: './activity-row.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityRowComponent {
	get CreatedAt(): string {
		return this.activityOverview.activities.reduce<string>((date: string, activity: Activity) => {
			return activity.date < date ? activity.date : date;
		}, getCurrentDateIso());
	}

	@Input()
	activityOverview!: ActivityOverview;
}

import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import parseDuration from 'parse-duration';

import { Activity } from '../../../../../../entities';
import { ActivityFormGroup } from '../../DailyActivitiesForm';
import { DailyActivityItemService } from '../../daily-activity-item/daily-activity-item.service';
import { PercentPipe } from '@angular/common';
import { AdjacentActivityComponent } from './adjacent-activity/adjacent-activity.component';

@Component({
	selector: 'app-activity-edit-modal',
	imports: [
		ReactiveFormsModule,
		PercentPipe,
		AdjacentActivityComponent,
	],
	templateUrl: './activity-edit-modal.component.html',
	styleUrl: './activity-edit-modal.component.scss',
	providers: [
		DailyActivityItemService,
	],
})
export class ActivityEditModalComponent {
	private readonly service = inject(DailyActivityItemService);
	public readonly modal = inject(NgbActiveModal);

	get PreviousTime(): string {
		if (this.previousActivity) {
			return this.previousActivity.till;
		} else {
			return '00:00';
		}
	}

	get NextTime(): string {
		if (this.nextActivity) {
			return this.nextActivity.from;
		} else {
			return '23:59';
		}
	}

	get RemainingTime(): number {
		const previous = DateTime.fromFormat(this.PreviousTime, 'H:mm');
		const next = DateTime.fromFormat(this.NextTime, 'H:mm');
		return next.diff(previous, 'minutes').minutes;
	}

	get ActivityDuration(): number {
		return parseDuration(this.activity.duration, 'm') ?? 0;
	}

	@Input()
	public activity!: Activity;

	@Input()
	public activityFormItem!: ActivityFormGroup;

	@Input()
	public previousActivity?: Activity;

	@Input()
	public nextActivity?: Activity;

	protected setCurrentTime(field: 'from' | 'till') {
		this.service.setCurrentTime(this.activityFormItem, field);
	}
}

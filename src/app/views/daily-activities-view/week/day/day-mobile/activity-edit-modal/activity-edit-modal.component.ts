import { Component, ElementRef, inject, Input, signal, viewChild } from '@angular/core';
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

	get Card(): HTMLElement {
		return this.cardBody().nativeElement;
	}

	@Input()
	public activity!: Activity;

	@Input()
	public activityFormItem!: ActivityFormGroup;

	@Input()
	public previousActivity?: Activity;

	@Input()
	public nextActivity?: Activity;

	isPicked = signal<boolean>(false);
	initialHeight = 0;
	startHeight = 0;

	private readonly cardBody = viewChild.required<ElementRef<HTMLElement>>('cardBody');

	protected setCurrentTime(field: 'from' | 'till') {
		this.service.setCurrentTime(this.activityFormItem, field);
	}

	protected onPointerDown(event: PointerEvent) {
		this.isPicked.set(true);
		this.initialHeight = event.clientY;
		this.startHeight = this.Card?.offsetHeight ?? 0;
	}

	protected onPointerMove(event: PointerEvent) {
		const diff = event.clientY - this.initialHeight;
		const updateHeight = this.startHeight + diff;
		this.Card.style.height = `${updateHeight}px`;
	}

	protected onPointerUp(event: PointerEvent) {
		this.isPicked.set(false);
	}
}

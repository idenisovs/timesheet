import { Component, ElementRef, inject, Input, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import parseDuration from 'parse-duration';

import { Activity } from '../../../../../../entities';
import { ActivityFormGroup } from '../../DailyActivitiesForm';
import { DailyActivityItemService } from '../../daily-activity-item/daily-activity-item.service';
import { AdjacentActivityComponent } from './adjacent-activity/adjacent-activity.component';
import { TimePickerComponent } from '../../../../../../components/time-picker/time-picker.component';

@Component({
	selector: 'app-activity-edit-modal',
	imports: [
		ReactiveFormsModule,
		AdjacentActivityComponent,
		TimePickerComponent,
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

	get Container(): HTMLElement {
		return this.cardContainer().nativeElement;
	}

	get Card(): HTMLElement {
		return this.card().nativeElement;
	}

	get ContainerBottom(): number {
		return Math.round(this.Container.getBoundingClientRect().bottom);
	}

	get CardBottom(): number {
		return Math.round(this.Card.getBoundingClientRect().bottom);
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
	startY = 0;
	startHeight = 0;
	maxBottom = 0;

	private readonly card = viewChild.required<ElementRef<HTMLElement>>('card');
	private readonly cardContainer = viewChild.required<ElementRef<HTMLElement>>('cardContainer');

	protected setCurrentTime(field: 'from' | 'till') {
		this.service.setCurrentTime(this.activityFormItem, field);
	}

	protected onPointerDown(event: PointerEvent) {
		this.isPicked.set(true);
		this.startY = event.clientY;
		this.startHeight = this.Card.offsetHeight;
		this.maxBottom = this.ContainerInnerBottom;
	}

	protected onPointerMove(event: PointerEvent) {
		const diff = event.clientY - this.startY;
		const updateHeight = this.startHeight + diff;
		this.Card.style.height = `${updateHeight}px`;

		const overshoot = this.CardOuterBottom - this.maxBottom;

		if (overshoot > 0) {
			this.Card.style.height = `${updateHeight - overshoot}px`;
		}
	}

	private get CardOuterBottom(): number {
		const cardStyle = getComputedStyle(this.Card);
		const marginBottom = parseFloat(cardStyle.marginBottom);
		return this.Card.getBoundingClientRect().bottom + marginBottom;
	}

	private get ContainerInnerBottom(): number {
		const containerStyle = getComputedStyle(this.Container);
		const paddingBottom = parseFloat(containerStyle.paddingBottom);
		return this.Container.getBoundingClientRect().bottom - paddingBottom;
	}

	protected onPointerUp(event: PointerEvent) {
		this.isPicked.set(false);
	}
}

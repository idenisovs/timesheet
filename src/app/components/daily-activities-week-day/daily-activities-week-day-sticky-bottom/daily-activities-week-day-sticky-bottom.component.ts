import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { Activity } from '../../../dto';
import { ActivitiesService } from '../../../services/activities.service';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-daily-activities-week-day-sticky-bottom',
	imports: [
		NgClass,
	],
	templateUrl: './daily-activities-week-day-sticky-bottom.component.html',
	styleUrl: './daily-activities-week-day-sticky-bottom.component.scss'
})
export class DailyActivitiesWeekDayStickyBottomComponent implements OnChanges, OnDestroy {
	private static readonly DEFAULT_COUNTDOWN: number = 5;

	activitiesService = inject(ActivitiesService);

	@Input()
	activities: Activity[] = [];

	@Input()
	isChanged = false;

	@Output()
	save = new EventEmitter<void>();

	@Output()
	reset = new EventEmitter<void>();

	countdown = DailyActivitiesWeekDayStickyBottomComponent.DEFAULT_COUNTDOWN;
	countdownSub?: Subscription;

	get TotalDuration() {
		return this.activitiesService.calculateDuration(this.activities);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['isChanged']) {
			if (this.isChanged) {
				this.startCountdown();
			} else {
				this.stopCountdown();
			}
		}
	}

	ngOnDestroy() {
		this.stopCountdown();
	}

	private startCountdown() {
		const { DEFAULT_COUNTDOWN } = DailyActivitiesWeekDayStickyBottomComponent
		this.countdown = DEFAULT_COUNTDOWN;

		this.countdownSub = interval(1000)
			.pipe(take(this.countdown))
			.subscribe((elapsed: number) => {
				this.updateCountdown(elapsed)
			});
	}

	private updateCountdown(elapsed: number): void {
		const { DEFAULT_COUNTDOWN } = DailyActivitiesWeekDayStickyBottomComponent
		this.countdown = DEFAULT_COUNTDOWN - (elapsed + 1);

		if (this.countdown <= 0) {
			this.autoSave();
		}
	}

	private autoSave() {
		this.save.emit();
		this.stopCountdown();
	}

	private stopCountdown() {
		if (this.countdownSub) {
			this.countdownSub.unsubscribe();
			delete this.countdownSub;
		}
	}
}

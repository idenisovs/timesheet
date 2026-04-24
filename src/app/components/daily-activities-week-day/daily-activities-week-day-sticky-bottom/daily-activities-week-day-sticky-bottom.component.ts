import { Component, effect, inject, input, OnDestroy, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Activity } from '../../../entities';
import { ActivitiesService } from '../../../services/activities.service';

@Component({
	selector: 'app-daily-activities-week-day-sticky-bottom',
	imports: [
		NgClass,
	],
	templateUrl: './daily-activities-week-day-sticky-bottom.component.html',
	styleUrl: './daily-activities-week-day-sticky-bottom.component.scss'
})
export class DailyActivitiesWeekDayStickyBottomComponent implements OnDestroy {
	private static readonly DEFAULT_COUNTDOWN: number = 5;

	private readonly activitiesService = inject(ActivitiesService);

	activities = input<Activity[]>([]);
	numberOfChanges = input<number>(0);

	save = output<void>();
	reset = output<void>();

	countdown = DailyActivitiesWeekDayStickyBottomComponent.DEFAULT_COUNTDOWN;
	countdownSub?: Subscription;

	constructor() {
		effect(() => {
			if (this.numberOfChanges() > 0) {
				this.stopCountdown();
				this.startCountdown();
			} else {
				this.stopCountdown();
			}
		});
	}

	get TotalDuration() {
		return this.activitiesService.calculateDuration(this.activities());
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

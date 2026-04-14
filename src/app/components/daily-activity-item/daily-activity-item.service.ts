import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import parseDuration from 'parse-duration';
import { DateTime } from 'luxon';

import { DurationService } from '../../services/duration.service';

const HOURS_PATTERN_24 = /^([0-2]?[0-3]|[0-1]?[0-9]):[0-5][0-9]$/;

@Injectable({
	providedIn: 'root',
})
export class DailyActivityItemService {
	durationService = inject(DurationService);

	getValue(activity: FormGroup, field: string): string {
		return activity.get(field)?.value;
	}

	getTimestamp(activity: FormGroup, field: string): number {
		const timeValue = this.getValue(activity, field);
		return DateTime.fromFormat(timeValue, 'H:mm').toMillis();
	}

	getDuration(activity: FormGroup): number {
		const duration = this.getValue(activity, 'duration');
		const dT = parseDuration(duration);
		return dT ? dT : 0;
	}

	getTimeStr(millis: number): string {
		return DateTime.fromMillis(millis).toFormat('HH:mm');
	}

	isTimeDefined(activity: FormGroup, field: string): boolean {
		const timeValue = this.getValue(activity, field);
		return HOURS_PATTERN_24.test(timeValue);
	}

	handleFromChanges(activity: FormGroup): void {
		if (!this.isTimeDefined(activity, 'from')) {
			activity.controls.duration.setValue(null);
			return;
		}

		if (this.isTimeDefined(activity, 'till')) {
			return this.recalculateDuration(activity);
		}

		const duration = this.getValue(activity, 'duration');

		if (duration) {
			this.recalculateTillTime(activity);
		}
	}

	handleTillChanges(activity: FormGroup): void {
		if (!this.isTimeDefined(activity, 'till')) {
			activity.controls.duration.setValue(null);
			return;
		}

		if (this.isTimeDefined(activity, 'from')) {
			return this.recalculateDuration(activity);
		}

		const duration = this.getValue(activity, 'duration');

		if (duration) {
			this.recalculateFromTime(activity);
		}
	}

	handleDurationChanges(activity: FormGroup) {
		const duration = this.getValue(activity, 'duration');
		const dT = parseDuration(duration);

		if (!dT) {
			return;
		}

		if (this.isTimeDefined(activity, 'from')) {
			return this.recalculateTillTime(activity);
		}

		if (this.isTimeDefined(activity, 'till')) {
			return this.recalculateFromTime(activity);
		}
	}

	recalculateFromTime(activity: FormGroup) {
		const d2 = this.getTimestamp(activity, 'till');
		const dT = this.getDuration(activity);
		const from = this.getTimeStr(d2 - dT);

		activity.get('from')?.patchValue(from);
	}

	recalculateTillTime(activity: FormGroup) {
		const d1 = this.getTimestamp(activity, 'from');
		const dT = this.getDuration(activity);
		const till = this.getTimeStr(d1 + dT);

		activity.get('till')?.patchValue(till);
	}

	recalculateDuration(activity: FormGroup) {
		const d1 = this.getTimestamp(activity, 'from');
		const d2 = this.getTimestamp(activity, 'till');
		const dT = Math.abs(d2 - d1);

		const durationValue = this.durationService.toStr(dT);

		activity.get('duration')?.patchValue(durationValue);
	}

	setCurrentTime(activity: FormGroup, field: 'from' | 'till') {
		const formField = activity.get(field);

		if (formField) {
			formField.setValue(this.getTimeStr(Date.now()));
		}

		if (field === 'from') {
			this.handleFromChanges(activity);
		} else {
			this.handleTillChanges(activity);
		}
	}
}

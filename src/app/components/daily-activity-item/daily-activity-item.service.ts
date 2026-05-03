import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import parseDuration from 'parse-duration';
import { DateTime } from 'luxon';

import { DurationService } from '../../services/duration.service';
import { SettingsService } from '../../services/settings.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

const HOURS_PATTERN_24 = /^([0-2]?[0-3]|[0-1]?[0-9]):[0-5][0-9]$/;

@Injectable()
export class DailyActivityItemService {
	private readonly durationService = inject(DurationService);
	private readonly settingsService = inject(SettingsService);
	private readonly activitiesRepository = inject(ActivitiesRepositoryService);

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

	getTimeStr(millis: number): string {
		const settings = this.settingsService.settings$();

		if (settings.isTimeRoundingEnabled) {
			millis = this.getRoundedTimestamp(millis);
		}

		return DateTime.fromMillis(millis).toFormat('HH:mm');
	}

	async findColorForName(name: string): Promise<string | null> {
		if (name.length === 0) return null;

		let existingActivity;

		const prefix = this.getPrefixFromName(name);

		if (prefix.length > 0) {
			existingActivity = await this.activitiesRepository.getFirstByNamePrefix(prefix)
		} else {
			existingActivity = await this.activitiesRepository.getFirstByName(name);
		}

		return existingActivity?.color ?? null;
	}

	findSiblingActivity(activities: ActivityFormGroup[], name: string, excludeId: string): ActivityFormGroup | undefined {
		return activities
			.filter(a => a.get('id')?.value !== excludeId && a.get('name')?.value?.length)
			.find(a => a.get('name')?.value === name);
	}

	findColorInActivities(activities: ActivityFormGroup[], name: string, excludeId: string): string | null {
		const siblingActivity = this.findSiblingActivity(activities, name, excludeId);
		return siblingActivity?.get('color')?.value ?? null;
	}

	getPrefixFromName(name: string): string {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	getRoundedTimestamp(millis: number): number {
		// Drop the second fraction
		const minute = parseDuration('1m') as number;
		millis = Math.floor(millis / minute) * minute;

		// Round to the nearest 5-minute step
		const step = parseDuration('5m') as number;
		return Math.round(millis / step) * step;
	}

	async isActivityUnique(name: string, id: string): Promise<boolean> {
		if (name.length === 0) {
			return false;
		}

		const prefix = this.getPrefixFromName(name);

		if (prefix.length > 0) {
			return this.activitiesRepository.isActivityPrefixUnique(id, prefix);
		}

		return this.activitiesRepository.isActivityNameUnique(id, name);
	}
}

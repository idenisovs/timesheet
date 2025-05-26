import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import parseDuration from 'parse-duration';

import { DurationService } from '../../services/duration.service';

const HOURS_PATTERN_24 = /^([0-2]?[0-3]|[0-1]?[0-9]):[0-5][0-9]$/

@Injectable({
  providedIn: 'root'
})
export class DailyActivityItemService {
  durationService = inject(DurationService);

  public parseTime(activity: FormGroup, field: string): number {
    const [hh, mm] = this.getValue(activity, field).split(':').map(Number);
    const date = new Date();
    date.setHours(hh, mm, 0, 0);
    return date.getTime();
  }

  getTimeString(date = new Date()): string {
    return date.toTimeString().slice(0, 5);
  }

  getDuration(activity: FormGroup): number {
    const duration = this.getValue(activity, 'duration');
    const dT = parseDuration(duration);
    return dT ? dT : 0;
  }

  getValue(activity: FormGroup, field: string): string {
    return activity.get(field)?.value;
  }

  isTimeDefined(activity: FormGroup, field: string): boolean {
    const timeValue = this.getValue(activity, field);
    return HOURS_PATTERN_24.test(timeValue);
  }

  handleFromChanges(activity: FormGroup): void {
    if (!this.isTimeDefined(activity, 'from')) {
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
      return;
    }

    if (this.isTimeDefined(activity, 'from')) {
      return this.recalculateDuration(activity);
    }

    const duration = this.getValue(activity, 'duration')

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
      return this.recalculateTillTime(activity)
    }

    if (this.isTimeDefined(activity, 'till')) {
      return this.recalculateFromTime(activity);
    }
  }

  recalculateTillTime(activity: FormGroup) {
    const d1 = this.parseTime(activity, 'from');
    const dT = this.getDuration(activity);
    const d2 = new Date(d1 + dT);

    const till = this.getTimeString(d2);

    activity.get('till')?.patchValue(till);
  }

  recalculateFromTime(activity: FormGroup) {
    const d2 = this.parseTime(activity, 'till');
    const dT = this.getDuration(activity);
    const d1 = new Date(d2 - dT);

    const fromTime = this.getTimeString(d1);

    activity.get('from')?.patchValue(fromTime);
  }

  recalculateDuration(activity: FormGroup) {
    const d1 = this.parseTime(activity, 'from');
    const d2 = this.parseTime(activity, 'till');
    const dT = Math.abs(d2 - d1);

    const durationValue = this.durationService.toStr(dT);

    activity.get('duration')?.patchValue(durationValue);
  }

  setCurrentTime(activity: FormGroup, field: 'from'|'till') {
    const formField = activity.get(field);

    if (formField) {
      formField.setValue(this.getTimeString());
    }

    if (field === 'from') {
      this.handleFromChanges(activity);
    } else {
      this.handleTillChanges(activity);
    }
  }
}

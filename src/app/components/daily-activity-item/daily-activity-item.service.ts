import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { duration } from 'yet-another-duration';
import parseDuration from 'parse-duration';

const HOURS_PATTERN_24 = /^([0-2]?[0-3]|[0-1]?[0-9]):[0-5][0-9]$/

@Injectable({
  providedIn: 'root'
})
export class DailyActivityItemService {

  constructor() { }

  public getTwoDigitFormat(x: number): string {
    if (x > 9) {
      return String(x);
    } else {
      return `0${x}`;
    }
  }

  public getTimeString(date: Date): string {
    const result: string[] = [];

    const hours = date.getHours();

    result.push(this.getTwoDigitFormat(hours));

    const minutes = date.getMinutes();

    result.push(this.getTwoDigitFormat(minutes));

    return result.join(':');
  }

  public getDateObj(activity: FormGroup, field: string): Date {
    const time = this.getValue(activity, field);

    const [hh, mm] = time.split(':');

    const date = new Date();

    date.setHours(Number(hh));
    date.setMinutes(Number(mm));

    return date;
  }

  getCurrentTime(): string {
    const date = new Date();
    const [hh, mm] = date.toTimeString().split(':');
    return `${hh}:${mm}`;
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
    const d1 = this.getDateObj(activity, 'from');
    const dT = this.getDuration(activity);
    const d2 = new Date(d1.getTime() + dT);

    const till = this.getTimeString(d2);

    activity.get('till')?.patchValue(till);
  }

  recalculateFromTime(activity: FormGroup) {
    const d2 = this.getDateObj(activity, 'till');
    const dT = this.getDuration(activity);
    const d1 = new Date(d2.getTime() - dT);

    const fromTime = this.getTimeString(d1);

    activity.get('from')?.patchValue(fromTime);
  }

  recalculateDuration(activity: FormGroup) {
    const d1 = this.getDateObj(activity, 'from').getTime();
    const d2 = this.getDateObj(activity, 'till').getTime();
    const dT = d1 > d2 ? d1 - d2 : d2 - d1;

    const durationValue = duration(dT, {
      units: {
        min: 'minutes'
      }
    }).toString();

    activity.get('duration')?.patchValue(durationValue);
  }

  setCurrentTime(activity: FormGroup, field: 'from'|'till') {
    const formField = activity.get(field);

    if (formField) {
      formField.setValue(this.getCurrentTime());
    }

    if (field === 'from') {
      this.handleFromChanges(activity);
    } else {
      this.handleTillChanges(activity);
    }
  }
}

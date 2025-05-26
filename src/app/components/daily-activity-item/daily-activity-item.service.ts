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

  public getDateObj(time: string): Date {
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

  getValue(activity: FormGroup, field: string): string {
    return activity.get(field)?.value;
  }

  isTimeDefined(activity: FormGroup, field: string): boolean {
    return false;
  }

  handleFromChanges(activity: FormGroup) {
    const from = this.getValue(activity, 'from');
    const isFromDefined = HOURS_PATTERN_24.test(from);

    if (!isFromDefined) {
      return;
    }

    const till = this.getValue(activity, 'till');
    const isTillDefined = HOURS_PATTERN_24.test(till);

    if (isTillDefined) {
      return this.recalculateDuration(activity);
    }

    const duration = this.getValue(activity, 'duration');

    if (duration) {
      this.recalculateTillTime(activity);
    }
  }

  handleTillChanges(activity: FormGroup) {
    const till = this.getValue(activity, 'till');
    const isTillDefined = HOURS_PATTERN_24.test(till);

    if (!isTillDefined) {
      return;
    }

    const from = this.getValue(activity, 'from');
    const isFromDefined = HOURS_PATTERN_24.test(from);

    if (isFromDefined) {
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

    const from = this.getValue(activity, 'from');
    const isFromDefined = HOURS_PATTERN_24.test(from);

    if (isFromDefined) {
      return this.recalculateTillTime(activity)
    }

    const till = this.getValue(activity, 'till');
    const isTillDefined = HOURS_PATTERN_24.test(till);

    if (isTillDefined) {
      return this.recalculateFromTime(activity);
    }
  }

  recalculateTillTime(activity: FormGroup) {
    const from = this.getValue(activity, 'from');
    const d1 = this.getDateObj(from);

    const duration = this.getValue(activity, 'duration');
    const dT = parseDuration(duration) as number;

    const d2 = new Date(d1.getTime() + dT);

    const till = this.getTimeString(d2);

    activity.get('till')?.patchValue(till);
  }

  recalculateFromTime(activity: FormGroup) {
    const till = this.getValue(activity, 'till');
    const d2 = this.getDateObj(till);

    const duration = this.getValue(activity, 'duration');
    const dT = parseDuration(duration);

    const d1 = new Date(d2.getTime() - dT!);

    const fromTime = this.getTimeString(d1);

    activity.get('from')?.patchValue(fromTime);
  }

  recalculateDuration(activity: FormGroup) {
    const from = this.getValue(activity, 'from');
    const d1 = this.getDateObj(from);

    const till = this.getValue(activity, 'till');
    const d2 = this.getDateObj(till);

    const dT = d2.getTime() - d1.getTime();

    const durationValue = duration(dT, {
      units: {
        min: 'minutes'
      }
    }).toString();

    console.log('Updating Duration!');
    console.log(durationValue);

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

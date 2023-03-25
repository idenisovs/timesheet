import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { duration } from 'yet-another-duration';
import parseDuration from 'parse-duration';

const HOURS_PATTERN_24 = /^([0-2]?[0-3]|[0-1]?[0-9]):[0-5][0-9]$/

@Component({
  selector: 'app-daily-activity-item',
  templateUrl: './daily-activity-item.component.html',
  styleUrls: ['./daily-activity-item.component.scss']
})
export class DailyActivityItemComponent implements OnInit {

  @Input()
  activity = this.fb.group({
    name: [''],
    from: [''],
    till: [''],
    duration: ['']
  });

  @Input()
  idx = 0;

  @Input()
  isLastActivity = false;

  @Input()
  isImported = false;

  @Output()
  add = new EventEmitter<void>();

  @Output()
  remove = new EventEmitter<number>();

  @Output()
  save = new EventEmitter<void>();

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {}

  handleFromChanges() {
    const from = this.activity.get('from')?.value;
    const isFromDefined = HOURS_PATTERN_24.test(from);

    if (!isFromDefined) {
      return;
    }

    const till = this.activity.get('till')?.value;
    const isTillDefined = HOURS_PATTERN_24.test(till);

    if (isTillDefined) {
      return this.recalculateDuration(from, till);
    }

    const duration = this.activity.get('duration')?.value;

    if (duration) {
      this.recalculateTillTime(from, duration);
    }
  }

  handleTillChanges() {
    const till = this.activity.get('till')?.value;
    const isTillDefined = HOURS_PATTERN_24.test(till);

    if (!isTillDefined) {
      return;
    }

    const from = this.activity.get('from')?.value;
    const isFromDefined = HOURS_PATTERN_24.test(from);

    if (isFromDefined) {
      return this.recalculateDuration(from, till)
    }

    const duration = this.activity.get('duration')?.value;

    if (duration) {
      this.recalculateFromTime(till, duration);
    }
  }

  handleDurationChanges() {
    const duration = this.activity.get('duration')?.value;

    const dT = parseDuration(duration);

    if (!dT) {
      return;
    }

    const from = this.activity.get('from')?.value;
    const isFromDefined = HOURS_PATTERN_24.test(from);

    if (isFromDefined) {
      return this.recalculateTillTime(from, duration)
    }

    const till = this.activity.get('till')?.value;
    const isTillDefined = HOURS_PATTERN_24.test(till);

    if (isTillDefined) {
      return this.recalculateFromTime(till, duration);
    }
  }

  recalculateFromTime(till: string, duration: string) {
    const d2 = this.getDateObj(till);

    const dT = parseDuration(duration);

    const d1 = new Date(d2.getTime() - dT!);

    const fromTime = this.getTimeString(d1);

    this.activity.get('from')?.setValue(fromTime);
  }

  recalculateTillTime(from: string, duration: string) {
    const d1 = this.getDateObj(from);

    const dT = parseDuration(duration);

    const d2 = new Date(d1.getTime() + dT!);

    const tillTime = this.getTimeString(d2);

    this.activity.get('till')?.setValue(tillTime);
  }

  recalculateDuration(from: string, till: string) {
    const d1 = this.getDateObj(from);
    const d2 = this.getDateObj(till);

    const dT = d2.getTime() - d1.getTime();

    const durationValue = duration(dT, {
      units: {
        min: 'minutes'
      }
    }).toString();

    this.activity.get('duration')?.setValue(durationValue);
  }

  getDateObj(time: string): Date {
    const [ hh, mm] = time.split(':');

    const date = new Date();

    date.setHours(Number(hh));
    date.setMinutes(Number(mm));

    return date;
  }

  getTimeString(date: Date): string {
    const result: string[] = [];

    const hours = date.getHours();

    result.push(this.getTwoDigitFormat(hours));

    const minutes = date.getMinutes();

    result.push(this.getTwoDigitFormat(minutes));

    return result.join(':');
  }

  getTwoDigitFormat(x: number): string {
    if (x > 10) {
      return String(x);
    } else {
      return `0${x}`;
    }
  }

}

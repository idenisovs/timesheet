import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { duration } from 'yet-another-duration';
import parseDuration from 'parse-duration';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';

const HOURS_PATTERN_24 = /^([0-2]?[0-3]|[0-1]?[0-9]):[0-5][0-9]$/

@Component({
  selector: 'app-daily-activity-item',
  templateUrl: './daily-activity-item.component.html',
  standalone: true,
  styleUrls: ['./daily-activity-item.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
  ],
})
export class DailyActivityItemComponent implements OnInit {
  @Input()
  activity = this.fb.group({
    id: [''],
    name: [''],
    from: [''],
    till: [''],
    duration: ['']
  });

  @Input()
  activities: ActivityFormGroup[] = [];

  @Input()
  idx = 0;

  @Input()
  isLastActivity = false;

  @Input()
  isImported = false;

  @Output()
  add = new EventEmitter<void>();

  @Output()
  remove = new EventEmitter<string>();

  @Output()
  save = new EventEmitter<void>();

  get ActivityId(): string {
    return this.activity.get('id')?.value;
  }

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

    const dT = parseDuration(duration) as number;

    const d2 = new Date(d1.getTime() + dT);

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
    const [hh, mm] = time.split(':');

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
    if (x > 9) {
      return String(x);
    } else {
      return `0${x}`;
    }
  }

  async copyActivityName() {
    const activityName: string | undefined = this.activity.get('name')?.value;

    if (navigator.clipboard && activityName) {
      await navigator.clipboard.writeText(activityName);
    }
  }

  async pasteActivityName() {
    let activityName = null;

    if (navigator.clipboard) {
      activityName = await navigator.clipboard.readText();
    }

    if (activityName) {
      this.activity.get('name')?.setValue(activityName);
    }
  }

  setCurrentTime(field: 'from'|'till') {
    const formField = this.activity.get(field);

    if (formField) {
      formField.setValue(this.getCurrentTime());
    }

    if (field === 'from') {
      this.handleFromChanges();
    } else {
      this.handleTillChanges();
    }
  }

  setTimeFromPreviousActivity() {
    const previousActivity = this.activities[this.idx - 1];
    const previousTillField = previousActivity.get('till');

    if (!previousTillField) {
      return;
    }

    const formField = this.activity.get('from');

    if (formField) {
      formField.setValue(previousTillField.value);
      this.handleFromChanges();
    }
  }

  getCurrentTime(): string {
    const date = new Date();
    const [hh, mm] = date.toTimeString().split(':');
    return `${hh}:${mm}`;
  }
}

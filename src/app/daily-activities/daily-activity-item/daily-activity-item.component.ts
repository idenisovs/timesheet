import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

  @Output()
  add = new EventEmitter<void>();

  @Output()
  remove = new EventEmitter<number>();

  @Output()
  save = new EventEmitter<void>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {}

  handleChanges() {
    const from = this.activity.get('from')?.value;
    const isFromDefined = HOURS_PATTERN_24.test(from);

    const till = this.activity.get('till')?.value;
    const isTillDefined = HOURS_PATTERN_24.test(till);

    const duration = this.activity.get('duration')?.value;

    if (isFromDefined && isTillDefined && !duration) {
      return this.recalculateDuration(from, till);
    }

    if (isFromDefined && !isTillDefined && duration) {
      return this.recalculateTillTime(from, duration);
    }

    if (!isFromDefined && isTillDefined && duration) {
      return this.recalculateFromTime();
    }
  }

  recalculateDuration(from: string, till: string) {
    const d1 = this.getDateObj(from);
    const d2 = this.getDateObj(till);

    const dT = d2.getTime() - d1.getTime();

    const durationValue = duration(dT, {
      units: {
        min: 'minutes'
      }
    });

    this.activity.get('duration')?.setValue(durationValue);
  }

  recalculateTillTime(from: string, duration: string) {
    const d1 = this.getDateObj(from);

    const dT = parseDuration(duration);

    console.log(dT);

    const d2 = new Date(d1.getTime() + dT!);

    console.log(d1, d2);

    const hours = d2.getHours();

    const minutes = d2.getMinutes();

    const tillTime = (hours > 10 ? hours : '0' + hours) + ':' + (minutes > 10 ? minutes : '0' + minutes);

    this.activity.get('till')?.setValue(tillTime);


  }

  recalculateFromTime() {
    console.log('Recalculate from time');
  }

  getDateObj(time: string): Date {
    const [ hh, mm] = time.split(':');

    const date = new Date();

    date.setHours(Number(hh));
    date.setMinutes(Number(mm));

    return date;
  }

}

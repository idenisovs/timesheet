import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

const HOURS_PATTERN = /^\d\d:\d\d$/

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
    const isFromDefined = HOURS_PATTERN.test(from);

    const till = this.activity.get('till')?.value;
    const isTillDefined = HOURS_PATTERN.test(till);

    const duration = this.activity.get('duration')?.value;

    if (isFromDefined && isTillDefined && !duration) {
      return this.recalculateDuration();
    }

    if (isFromDefined && !isTillDefined && duration) {
      return this.recalculateTillTime();
    }

    if (!isFromDefined && isTillDefined && duration) {
      return this.recalculateFromTime();
    }
  }

  recalculateDuration() {
    console.log('Recalculate duration!');
  }

  recalculateTillTime() {
    console.log('Recalculate till time');
  }

  recalculateFromTime() {
    console.log('Recalculate from time');
  }

}

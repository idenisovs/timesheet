import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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

  ngOnInit(): void {
  }

}

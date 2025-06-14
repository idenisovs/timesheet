import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-daily-activity-item-card',
  imports: [],
  templateUrl: './daily-activity-item-card.component.html',
  styleUrl: './daily-activity-item-card.component.scss'
})
export class DailyActivityItemCardComponent {
  fb = inject(FormBuilder);

  @Input()
  activity = this.fb.group({
    id: [''],
    name: [''],
    from: [''],
    till: [''],
    duration: ['']
  });
}

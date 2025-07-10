import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityEditModalComponent } from './activity-edit-modal/activity-edit-modal.component';

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

  @Output()
  activate = new EventEmitter<FormGroup>();

  markActive() {
    this.activate.emit(this.activity);
  }
}

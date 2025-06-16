import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  modalService = inject(NgbModal);

  @Input()
  activity = this.fb.group({
    id: [''],
    name: [''],
    from: [''],
    till: [''],
    duration: ['']
  });

  message() {
    const modalRef = this.modalService.open(ActivityEditModalComponent, {
      centered: true
    });

    modalRef.componentInstance.activity = this.activity;

    modalRef.result.then(() => {
      console.log('Update activity!');
    }).catch(() => {
      console.log('Cancel update!');
    });
  }
}

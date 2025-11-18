import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-activity-item-edit-modal',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './activity-item-edit-modal.component.html',
  styleUrl: './activity-item-edit-modal.component.scss'
})
export class ActivityItemEditModalComponent {
  modal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  form = this.fb.group({
    name: [''],
  });

  save() {
    this.modal.close(this.form.get('name')?.value);
  }

  cancel() {
    this.modal.dismiss('cancel');
  }
}

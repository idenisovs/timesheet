import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss'
})
export class CreateProjectModalComponent {
  constructor(private modal: NgbActiveModal) {}

  cancel() {
    this.modal.close(null);
  }
}

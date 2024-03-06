import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-issue-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './create-issue-modal.component.html',
  styleUrl: './create-issue-modal.component.scss'
})
export class CreateIssueModalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  cancel() {
    this.activeModal.dismiss(null);
  }
}

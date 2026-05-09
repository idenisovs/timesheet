import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-confirm-regenerate-modal',
	templateUrl: './confirm-regenerate-modal.component.html',
})
export class ConfirmRegenerateModalComponent {
	private readonly modal = inject(NgbActiveModal);

	confirm() {
		this.modal.close(true);
	}

	cancel() {
		this.modal.close(false);
	}
}

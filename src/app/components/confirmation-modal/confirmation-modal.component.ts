import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
	private readonly modal = inject(NgbActiveModal);

	save() {
		this.modal.close(true);
	}

	cancel() {
		this.modal.close(false);
	}
}

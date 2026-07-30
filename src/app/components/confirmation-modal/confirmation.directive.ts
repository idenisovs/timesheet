import { Directive, HostListener, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { handleModalResult } from '@utils/index';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@Directive({
	selector: '[appConfirmation]',
})
export class ConfirmationDirective {
	private readonly modalService = inject(NgbModal);

	public readonly form: InputSignal<AbstractControl> =
		input.required<AbstractControl>({ alias: 'appConfirmation' });

	// Emits once the guarded action is allowed to proceed: `true` when the user
	// chose to save pending changes, `false` when the form was already pristine.
	public readonly confirmed: OutputEmitterRef<boolean> = output<boolean>();

	@HostListener('click')
	protected async onClick(): Promise<void> {
		if (!this.form().dirty) {
			this.confirmed.emit(false);
			return;
		}

		const shouldSave = await handleModalResult<boolean>(
			this.modalService.open(ConfirmationModalComponent).result,
		);

		if (!shouldSave) {
			return;
		}

		this.confirmed.emit(true);
	}
}

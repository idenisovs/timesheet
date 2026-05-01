import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ColorsService } from '../../../services/colors.service';
import { handleModalResult } from '../../../utils';
import { ConfirmRegenerateModalComponent } from './confirm-regenerate-modal/confirm-regenerate-modal.component';

@Component({
	selector: 'app-color-regenerate-settings',
	imports: [],
	templateUrl: './color-regenerate-settings.component.html',
})
export class ColorRegenerateSettingsComponent {
	private readonly modal = inject(NgbModal);
	private readonly colorsService = inject(ColorsService);

	async regenerate() {
		const confirmed = await handleModalResult<boolean>(
			this.modal.open(ConfirmRegenerateModalComponent).result,
		);

		if (confirmed) {
			this.colorsService.regenerateActivityColors().then(() => {
				alert('Done!');
			});
		}
	}
}

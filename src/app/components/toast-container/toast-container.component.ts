import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastService } from '@services/toast.service';

@Component({
	selector: 'app-toast-container',
	imports: [NgbToastModule],
	templateUrl: './toast-container.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class ToastContainerComponent {
	protected readonly toastService = inject(ToastService);
}

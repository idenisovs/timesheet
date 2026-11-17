import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
	message: string;
	type: 'danger' | 'success';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	private readonly toastMessages = signal<ToastMessage[]>([]);

	readonly toasts = this.toastMessages.asReadonly();

	showError(message: string) {
		this.add({ message, type: 'danger' });
	}

	showSuccess(message: string) {
		this.add({ message, type: 'success' });
	}

	remove(toast: ToastMessage) {
		this.toastMessages.update(toasts => toasts.filter(item => item !== toast));
	}

	private add(toast: ToastMessage) {
		this.toastMessages.update(toasts => [...toasts, toast]);
	}
}

import { Injectable, signal } from '@angular/core';

export interface ErrorToast {
	message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	private readonly messages = signal<ErrorToast[]>([]);
	readonly toasts = this.messages.asReadonly();

	showError(message: string) {
		this.messages.update(toasts => [...toasts, { message }]);
	}

	remove(toast: ErrorToast) {
		this.messages.update(toasts => toasts.filter(item => item !== toast));
	}
}

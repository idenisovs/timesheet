import { ValidatorFn } from '@angular/forms';

export const syncUrlValidator: ValidatorFn = control => {
	if (!control.value) {
		return null;
	}

	if (!/^https?:\/\//i.test(control.value) || /[\s\\]/.test(control.value)) {
		return { syncUrl: true };
	}

	try {
		const url = new URL(control.value);

		if (url.protocol === 'http:' || url.protocol === 'https:') {
			return null;
		}
	} catch {
		return { syncUrl: true };
	}

	return { syncUrl: true };
};

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SettingsService {
	private readonly storageKey = 'settings';

	async load() {}
}

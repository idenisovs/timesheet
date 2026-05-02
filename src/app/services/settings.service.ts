import { Injectable, signal } from '@angular/core';
import { AppSettings } from '../entities';

const DEFAULT_SETTINGS: AppSettings = {
	isTimeRoundingEnabled: false,
	isOppositeColorMode: false,
	isDiagnosticPanelVisible: false,
};

@Injectable({
	providedIn: 'root',
})
export class SettingsService {
	private readonly storageKey = 'settings';
	private loaded = signal(false);
	private settings = signal<AppSettings>(DEFAULT_SETTINGS);
	public readonly settings$ = this.settings.asReadonly();

	public async load() {
		if (this.loaded()) throw new Error('Settings already loaded!');

		const raw = localStorage.getItem(this.storageKey);

		if (!raw) {
			this.loaded.set(true);
			return;
		}

		const parsed = JSON.parse(raw) as Partial<AppSettings>;
		this.settings.update(_ => ({ ...DEFAULT_SETTINGS, ...parsed }));
		this.loaded.set(true);
	}

	public update(settings: Partial<AppSettings>) {
		this.settings.update(prev => ({ ...prev, ...settings }));
		this.save();
	}

	private save() {
		localStorage.setItem(this.storageKey, JSON.stringify(this.settings()));
	}
}

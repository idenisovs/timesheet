import { Injectable } from '@angular/core';
import { AppSettings } from '../entities';

const DEFAULT_SETTINGS: AppSettings = {
	isTimeRoundingEnabled: false,
};


@Injectable({
	providedIn: 'root',
})
export class SettingsService {
	private readonly storageKey = 'settings';
	private loaded = false;
	private settings: AppSettings = DEFAULT_SETTINGS;

	public async load() {
		if (this.loaded) throw new Error('Settings already loaded!');

		const raw = localStorage.getItem(this.storageKey);

		if (!raw) {
			this.settings = { ...DEFAULT_SETTINGS };
			this.loaded = true;
			return;
		}

		const parsed = JSON.parse(raw) as Partial<AppSettings>;
		this.settings = { ...DEFAULT_SETTINGS, ...parsed };
		this.loaded = true;
	}

	public update(settings: Partial<AppSettings>) {
		this.settings = { ...this.settings, ...settings };
		this.save();
	}

	private save() {
		localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
	}
}

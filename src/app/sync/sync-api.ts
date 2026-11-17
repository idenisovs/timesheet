import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { SettingsService } from '@services/settings.service';

@Injectable({ providedIn: 'root' })
export class SyncService {
	private readonly http = inject(HttpClient);
	private readonly settingsService = inject(SettingsService);

	getHealthcheck() {
		const serviceUrl = this.settingsService.settings$().syncServiceUrl;

		const url = new URL('/healthcheck', serviceUrl);

		return this.http.get(url.toString(), {
			observe: 'response',
			responseType: 'text',
		});
	}
}

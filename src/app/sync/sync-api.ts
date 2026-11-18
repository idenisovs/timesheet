import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { SettingsService } from '@services/settings.service';

@Injectable({ providedIn: 'root' })
export class SyncApiService {
	private readonly http = inject(HttpClient);
	readonly settingsService = inject(SettingsService);

	@SyncServiceGuard
	getHealthcheck() {
		const serviceUrl = this.settingsService.settings$().syncServiceUrl;

		const url = new URL('/healthcheck', serviceUrl);

		return this.http.get(url.toString(), {
			observe: 'response',
			responseType: 'text',
		});
	}
}

interface SyncServiceGuardContext {
	readonly settingsService: SettingsService;
}

export function SyncServiceGuard<Args extends unknown[], Return>(
	_target: object,
	_propertyKey: string | symbol,
	descriptor: TypedPropertyDescriptor<(this: SyncServiceGuardContext, ...args: Args) => Return>,
) {
	const method = descriptor.value!;

	descriptor.value = function (this: SyncServiceGuardContext, ...args: Args): Return {
		if (!this.settingsService.settings$().isSyncServiceEnabled) {
			throw new Error('Timesheet Sync Service is disabled.');
		}

		return method.apply(this, args);
	};
}

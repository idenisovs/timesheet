import { HttpClient, HttpResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsService } from '@services/settings.service';
import { Change } from '@entities';
import { SyncApiService } from './sync-api';

describe('SyncApiService', () => {
	const settings = signal({ isSyncServiceEnabled: false, syncServiceUrl: 'https://example.com' });
	const http = { get: vi.fn(), post: vi.fn() };

	beforeEach(() => {
		settings.set({ isSyncServiceEnabled: false, syncServiceUrl: 'https://example.com' });
		vi.clearAllMocks();
		TestBed.configureTestingModule({
			providers: [
				{ provide: HttpClient, useValue: http },
				{ provide: SettingsService, useValue: { settings$: settings.asReadonly() } },
			],
		});
	});

	it('rejects calls when sync is disabled and allows them after it is enabled', () => {
		const service = TestBed.inject(SyncApiService);
		const response = new HttpResponse({ body: 'OK' });
		http.get.mockReturnValue(of(response));

		expect(() => service.getHealthcheck()).toThrow('Timesheet Sync Service is disabled.');
		expect(http.get).not.toHaveBeenCalled();

		settings.set({ isSyncServiceEnabled: true, syncServiceUrl: 'https://example.com' });
		service.getHealthcheck().subscribe(result => expect(result).toBe(response));
		expect(http.get).toHaveBeenCalledWith('https://example.com/healthcheck', {
			observe: 'response',
			responseType: 'text',
		});
	});

	it('posts changes to the sync endpoint', () => {
		const service = TestBed.inject(SyncApiService);
		const changes = [new Change()];
		http.post.mockReturnValue(of(undefined));

		expect(() => service.sync(changes)).toThrow('Timesheet Sync Service is disabled.');
		settings.set({ isSyncServiceEnabled: true, syncServiceUrl: 'https://example.com' });
		service.sync(changes).subscribe();

		expect(http.post).toHaveBeenCalledWith('https://example.com/sync', changes);
	});
});

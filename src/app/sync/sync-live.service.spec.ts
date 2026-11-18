import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsService } from '@services/settings.service';
import { ToastService } from '@services/toast.service';
import { SyncApiService } from './sync-api';
import { SyncLiveService } from './sync-live.service';

describe('SyncLiveService', () => {
	const settings = signal({ isSyncServiceEnabled: false, syncServiceUrl: '' });
	const sync = { getHealthcheck: vi.fn() };
	const toast = { showError: vi.fn(), showSuccess: vi.fn() };

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		settings.set({ isSyncServiceEnabled: false, syncServiceUrl: '' });
		TestBed.configureTestingModule({
			providers: [
				{ provide: SettingsService, useValue: { settings$: settings.asReadonly() } },
				{ provide: SyncApiService, useValue: sync },
				{ provide: ToastService, useValue: toast },
			],
		});
	});

	afterEach(() => {
		TestBed.resetTestingModule();
		vi.useRealTimers();
	});

	it('starts checking only when enabled and a URL is configured', () => {
		sync.getHealthcheck.mockReturnValue(of(new HttpResponse({ body: 'OK' })));
		settings.set({ isSyncServiceEnabled: false, syncServiceUrl: 'https://example.com' });
		TestBed.inject(SyncLiveService);
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).not.toHaveBeenCalled();

		settings.set({ isSyncServiceEnabled: true, syncServiceUrl: '' });
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).not.toHaveBeenCalled();

		settings.set({ isSyncServiceEnabled: true, syncServiceUrl: 'https://example.com' });
		TestBed.tick();
		vi.advanceTimersByTime(0);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(1);

		settings.set({ isSyncServiceEnabled: true, syncServiceUrl: '' });
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(1);
	});

	it('checks configured service and reports each failure and recovery once', () => {
		const failure = new HttpErrorResponse({ status: 503, error: 'Unavailable' });
		sync.getHealthcheck.mockReturnValue(throwError(() => failure));
		const service = TestBed.inject(SyncLiveService);
		TestBed.tick();
		expect(service.status()).toBe('checking');
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).not.toHaveBeenCalled();

		settings.set({ isSyncServiceEnabled: true, syncServiceUrl: 'https://example.com' });
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(2);
		expect(service.status()).toBe('failed');
		expect(service.lastResponse()).toBe('Unavailable');
		expect(toast.showError).toHaveBeenCalledTimes(1);

		const response = new HttpResponse({ body: 'OK' });
		sync.getHealthcheck.mockReturnValue(of(response));
		vi.advanceTimersByTime(120_000);
		expect(service.status()).toBe('alive');
		expect(service.lastResponse()).toBe('OK');
		expect(toast.showSuccess).toHaveBeenCalledTimes(1);

		settings.set({ isSyncServiceEnabled: false, syncServiceUrl: 'https://example.com' });
		TestBed.tick();
		expect(service.status()).toBe('alive');
		expect(service.lastResponse()).toBe('OK');
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(4);
	});
});

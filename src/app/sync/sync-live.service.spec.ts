import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SettingsService } from '@services/settings.service';
import { ToastService } from '@services/toast.service';
import { SyncService } from './sync-api';
import { SyncLiveService } from './sync-live.service';

describe('SyncLiveService', () => {
	const settings = signal({ syncServiceUrl: '' });
	const sync = { getHealthcheck: vi.fn() };
	const toast = { showError: vi.fn(), showSuccess: vi.fn() };

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
		settings.set({ syncServiceUrl: '' });
		TestBed.configureTestingModule({
			providers: [
				{ provide: SettingsService, useValue: { settings$: settings.asReadonly() } },
				{ provide: SyncService, useValue: sync },
				{ provide: ToastService, useValue: toast },
			],
		});
	});

	afterEach(() => {
		TestBed.resetTestingModule();
		vi.useRealTimers();
	});

	it('checks configured service and reports each failure and recovery once', () => {
		const failure = new HttpErrorResponse({ status: 503, error: 'Unavailable' });
		sync.getHealthcheck.mockReturnValue(throwError(() => failure));
		const service = TestBed.inject(SyncLiveService);
		TestBed.tick();
		expect(service.status()).toBe('checking');
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).not.toHaveBeenCalled();

		settings.set({ syncServiceUrl: 'https://example.com' });
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(2);
		expect(service.isFailed()).toBe(true);
		expect(service.status()).toBe('failed');
		expect(service.lastResponse()).toBe('Unavailable');
		expect(toast.showError).toHaveBeenCalledTimes(1);

		const response = new HttpResponse({ body: 'OK' });
		sync.getHealthcheck.mockReturnValue(of(response));
		vi.advanceTimersByTime(120_000);
		expect(service.isFailed()).toBe(false);
		expect(service.status()).toBe('alive');
		expect(service.lastResponse()).toBe('OK');
		expect(toast.showSuccess).toHaveBeenCalledTimes(1);

		settings.set({ syncServiceUrl: '' });
		TestBed.tick();
		expect(service.status()).toBe('checking');
		expect(service.lastResponse()).toBeNull();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(4);
	});
});

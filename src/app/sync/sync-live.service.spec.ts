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
		sync.getHealthcheck.mockReturnValue(throwError(() => new Error('offline')));
		const service = TestBed.inject(SyncLiveService);
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).not.toHaveBeenCalled();

		settings.set({ syncServiceUrl: 'https://example.com' });
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(2);
		expect(service.isFailed()).toBe(true);
		expect(toast.showError).toHaveBeenCalledTimes(1);

		sync.getHealthcheck.mockReturnValue(of({}));
		vi.advanceTimersByTime(120_000);
		expect(service.isFailed()).toBe(false);
		expect(toast.showSuccess).toHaveBeenCalledTimes(1);

		settings.set({ syncServiceUrl: '' });
		TestBed.tick();
		vi.advanceTimersByTime(60_000);
		expect(sync.getHealthcheck).toHaveBeenCalledTimes(4);
	});
});

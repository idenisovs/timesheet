import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Change } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SyncApiService } from './sync-api';
import { SyncLiveService } from './sync-live.service';
import { SyncService } from './sync.service';

describe('SyncService', () => {
	afterEach(() => {
		TestBed.resetTestingModule();
		vi.useRealTimers();
	});

	it('waits for closely spaced changes before starting sync', async () => {
		vi.useFakeTimers();
		const status = signal<'alive' | 'failed'>('alive');
		const pending = new Subject<boolean>();
		const getPendingBatch = vi.fn().mockResolvedValue([]);

		TestBed.configureTestingModule({
			providers: [
				{ provide: ChangeRepositoryService, useValue: { hasPendingChanges$: pending, getPendingBatch } },
				{ provide: SyncLiveService, useValue: { status: status.asReadonly() } },
				{ provide: SyncApiService, useValue: {} },
			],
		});
		TestBed.inject(SyncService);
		TestBed.tick();

		pending.next(true);
		await vi.advanceTimersByTimeAsync(400);
		pending.next(true);
		await vi.advanceTimersByTimeAsync(400);
		expect(getPendingBatch).not.toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(100);
		expect(getPendingBatch).toHaveBeenCalledTimes(1);
	});

	it('passes a batch of pending changes to the sync API', async () => {
		const status = signal<'alive' | 'failed'>('alive');
		const pending = new Subject<boolean>();
		const changes = [new Change()];
		const getPendingBatch = vi.fn()
			.mockResolvedValueOnce(changes)
			.mockResolvedValueOnce([]);
		const response = new Subject<void>();
		const sync = vi.fn().mockReturnValue(response);
		const update = vi.fn().mockResolvedValue(undefined);

		TestBed.configureTestingModule({
			providers: [
				{ provide: ChangeRepositoryService, useValue: { hasPendingChanges$: pending, getPendingBatch, update } },
				{ provide: SyncLiveService, useValue: { status: status.asReadonly() } },
				{ provide: SyncApiService, useValue: { sync } },
			],
		});
		TestBed.inject(SyncService);
		TestBed.tick();
		pending.next(true);

		await vi.waitFor(() => expect(sync).toHaveBeenCalledWith(changes));
		expect(getPendingBatch).toHaveBeenCalledTimes(1);
		expect(update).not.toHaveBeenCalled();
		response.next();
		await vi.waitFor(() => expect(getPendingBatch).toHaveBeenCalledTimes(2));
		expect(update).toHaveBeenCalledWith(changes);
		expect(changes[0].status).toBe('synced');
		expect(changes[0].syncedAt).toBeInstanceOf(Date);
	});
});

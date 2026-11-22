import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Change } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { SyncApiService } from './sync-api';
import { SyncLiveService } from './sync-live.service';
import { SyncService } from './sync.service';

describe('SyncService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{ provide: SyncLiveService, useValue: { status: () => 'alive' } }],
		});
	});

	afterEach(() => {
		TestBed.resetTestingModule();
		vi.useRealTimers();
	});

	it('waits for closely spaced changes before starting sync', async () => {
		vi.useFakeTimers();
		const pending = new Subject<boolean>();
		const getPendingBatch = vi.fn().mockResolvedValue([]);

		TestBed.configureTestingModule({
			providers: [
				{ provide: ChangeRepositoryService, useValue: { hasPendingChanges$: pending, getPendingBatch } },
				{ provide: SyncApiService, useValue: {} },
			],
		});
		TestBed.inject(SyncService);
		TestBed.tick();

		pending.next(true);
		await vi.advanceTimersByTimeAsync(400);
		pending.next(true);
		await vi.advanceTimersByTimeAsync(900);
		expect(getPendingBatch).not.toHaveBeenCalled();
		await vi.advanceTimersByTimeAsync(100);
		expect(getPendingBatch).toHaveBeenCalledTimes(1);
	});

	it('passes a batch of pending changes to the sync API', async () => {
		vi.useFakeTimers();
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
				{ provide: SyncApiService, useValue: { sync } },
			],
		});
		TestBed.inject(SyncService);
		TestBed.tick();
		pending.next(true);
		await vi.advanceTimersByTimeAsync(1000);

		expect(sync).toHaveBeenCalledWith(changes);
		expect(getPendingBatch).toHaveBeenCalledTimes(1);
		expect(update).not.toHaveBeenCalled();
		response.next();
		await vi.advanceTimersByTimeAsync(0);
		expect(getPendingBatch).toHaveBeenCalledTimes(2);
		expect(update).toHaveBeenCalledWith(changes);
		expect(changes[0].status).toBe('synced');
		expect(changes[0].syncedAt).toBeInstanceOf(Date);
	});
});

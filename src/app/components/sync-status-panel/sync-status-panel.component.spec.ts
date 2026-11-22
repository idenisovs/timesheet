import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { SyncService } from '../../sync/sync.service';
import { SyncStatusPanelComponent } from './sync-status-panel.component';

describe('SyncStatusPanelComponent', () => {
	it('shows the syncing badge before the timestamp while sync is running', async () => {
		const isSyncing = signal(false);
		const lastSyncedAt = signal<Date | null>(null);
		await TestBed.configureTestingModule({
			imports: [SyncStatusPanelComponent],
			providers: [{ provide: SyncService, useValue: { isSyncing, lastSyncedAt } }],
		}).compileComponents();

		const fixture = TestBed.createComponent(SyncStatusPanelComponent);
		const panel: HTMLElement = fixture.nativeElement;
		await fixture.whenStable();
		expect(panel.querySelector('.badge')).toBeNull();

		isSyncing.set(true);
		await fixture.whenStable();
		expect(panel.querySelector('.badge.text-bg-info')?.textContent).toBe('Syncing…');

		const timestamp = new Date(2026, 10, 22, 15, 30);
		lastSyncedAt.set(timestamp);
		await fixture.whenStable();
		const badges = panel.querySelectorAll('.badge');
		expect(badges[0]?.textContent).toBe('Syncing…');
		expect(badges[1]?.textContent).toBe('Synced at 22 Nov 2026, 15:30');

		isSyncing.set(false);
		await fixture.whenStable();
		expect(panel.querySelector('.badge.text-bg-info')).toBeNull();
		expect(panel.querySelector('.badge.text-bg-success')?.textContent).toBe('Synced at 22 Nov 2026, 15:30');
	});
});

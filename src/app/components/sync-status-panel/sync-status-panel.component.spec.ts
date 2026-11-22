import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { SyncService } from '../../sync/sync.service';
import { SyncStatusPanelComponent } from './sync-status-panel.component';

describe('SyncStatusPanelComponent', () => {
	it('shows the latest timestamp when a sync is recorded', async () => {
		const lastSyncedAt$ = new BehaviorSubject<Date | null>(null);
		await TestBed.configureTestingModule({
			imports: [SyncStatusPanelComponent],
			providers: [{ provide: SyncService, useValue: { lastSyncedAt$ } }],
		}).compileComponents();

		const fixture = TestBed.createComponent(SyncStatusPanelComponent);
		const panel: HTMLElement = fixture.nativeElement;
		await fixture.whenStable();
		expect(panel.querySelector('.badge')).toBeNull();

		const timestamp = new Date(2026, 10, 22, 15, 30);
		lastSyncedAt$.next(timestamp);
		await fixture.whenStable();

		expect(panel.querySelector('.badge')?.textContent).toBe('Synced at 22 Nov 2026, 15:30');
	});
});

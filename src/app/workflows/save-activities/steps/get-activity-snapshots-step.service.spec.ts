import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { GetActivitySnapshotsStepService } from './get-activity-snapshots-step.service';

describe('GetActivitySnapshotsStepService', () => {
	it('captures new, changed and removed activities, skipping unchanged ones', async () => {
		const old = new Activity();
		old.createdAt = new Date('2020-01-01');
		old.updatedAt = new Date('2020-01-02');
		const changed = new Activity(old);
		changed.name = 'Changed';
		const unchanged = new Activity();
		const created = new Activity();
		const removed = new Activity();
		const getById = vi.fn().mockResolvedValueOnce(old).mockResolvedValueOnce(unchanged).mockResolvedValueOnce(null);
		TestBed.configureTestingModule({ providers: [GetActivitySnapshotsStepService,
			{ provide: ActivityRepositoryService, useValue: { getById } }] });
		const context = { activities: { toSave: [changed, unchanged, created], toRemove: [removed] },
			snapshots: [] };

		await TestBed.inject(GetActivitySnapshotsStepService).execute(context);

		expect(context.snapshots).toEqual([
			{ before: old, after: changed }, { before: null, after: created }, { before: removed, after: null },
		]);
	});
});

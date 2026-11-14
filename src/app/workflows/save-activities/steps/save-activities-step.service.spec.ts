import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveActivitiesStepService } from './save-activities-step.service';

describe('SaveActivitiesStepService', () => {
	it('saves after values and removes activities with no after value', async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const remove = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({ providers: [SaveActivitiesStepService,
			{ provide: ActivityRepositoryService, useValue: { save, remove } }] });
		const created = new Activity();
		const original = new Activity();
		const updated = new Activity(original);
		const removed = new Activity();

		await TestBed.inject(SaveActivitiesStepService).execute({
			activities: { toSave: [], toRemove: [] },
			snapshots: [{ before: null, after: created }, { before: original, after: updated },
				{ before: removed, after: null }, { before: null, after: null }],
			affectedIssues: [],
		});

		expect(save).toHaveBeenCalledTimes(2);
		expect(save).toHaveBeenNthCalledWith(1, [created]);
		expect(save).toHaveBeenNthCalledWith(2, [updated]);
		expect(remove).toHaveBeenCalledExactlyOnceWith([removed]);
	});
});

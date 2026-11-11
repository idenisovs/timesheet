import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetActivitySnapshotsStepService } from './get-activity-snapshots-step.service';

describe('GetActivitySnapshotsStepService', () => {
	let snapshotsStep: GetActivitySnapshotsStepService;
	let getByIds: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getByIds = vi.fn();
		TestBed.configureTestingModule({
			providers: [
				GetActivitySnapshotsStepService,
				{ provide: ActivityRepositoryService, useValue: { getByIds } },
			],
		});
		snapshotsStep = TestBed.inject(GetActivitySnapshotsStepService);
	});

	it('loads the stored activities before saving and removing them', async () => {
		const toSave = new Activity();
		const newActivity = new Activity();
		const toRemove = new Activity();
		const beforeSave = new Activity(toSave);
		const beforeRemove = new Activity(toRemove);
		getByIds.mockResolvedValueOnce([beforeSave]).mockResolvedValueOnce([beforeRemove]);
		const context = {
			activities: {
				toSave: [toSave, newActivity],
				toRemove: [toRemove],
			},
			snapshots: {
				beforeSave: [] as Activity[],
				beforeRemove: [] as Activity[],
			},
			affectedIssues: [],
		};

		await snapshotsStep.execute(context);

		expect(getByIds.mock.calls).toEqual([[ [toSave.id, newActivity.id] ], [ [toRemove.id] ]]);
		expect(context.snapshots.beforeSave).toEqual([beforeSave]);
		expect(context.snapshots.beforeRemove).toEqual([beforeRemove]);
	});

	it('propagates a lookup failure without attempting the next lookup', async () => {
		const error = new Error('Lookup failed');
		getByIds.mockRejectedValue(error);
		const context = {
			activities: {
				toSave: [new Activity()],
				toRemove: [new Activity()],
			},
			snapshots: {
				beforeSave: [] as Activity[],
				beforeRemove: [] as Activity[],
			},
			affectedIssues: [],
		};

		await expect(snapshotsStep.execute(context)).rejects.toBe(error);

		expect(getByIds).toHaveBeenCalledOnce();
	});
});

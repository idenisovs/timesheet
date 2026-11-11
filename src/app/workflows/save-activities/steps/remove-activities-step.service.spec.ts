import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Activity } from '@entities';
import { ActivitiesRepositoryService } from '@repository/activities-repository.service';
import { RemoveActivitiesStepService } from './remove-activities-step.service';

describe('RemoveActivitiesStepService', () => {
	let removeStep: RemoveActivitiesStepService;
	let getByIds: ReturnType<typeof vi.fn>;
	let remove: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getByIds = vi.fn();
		remove = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				RemoveActivitiesStepService,
				{ provide: ActivitiesRepositoryService, useValue: { getByIds, remove } },
			],
		});

		removeStep = TestBed.inject(RemoveActivitiesStepService);
	});

	it('removes stored activities and appends their issue IDs to the context', async () => {
		const requested = new Activity();
		requested.issueId = 'outdated-issue';
		const missing = new Activity();
		const stored = new Activity();
		stored.id = requested.id;
		stored.issueId = 'stored-issue';
		const unlinked = new Activity();
		getByIds.mockResolvedValue([stored, unlinked]);

		const context = {
			activitiesToSave: [],
			activitiesToRemove: [requested, missing, unlinked],
			affectedIssueIds: ['existing-issue'],
		};

		await removeStep.execute(context);

		expect(getByIds).toHaveBeenCalledExactlyOnceWith([requested.id, missing.id, unlinked.id]);
		expect(remove).toHaveBeenCalledExactlyOnceWith([stored, unlinked]);
		expect(context.affectedIssueIds).toEqual(['existing-issue', 'stored-issue']);
	});

	it('propagates a repository lookup failure without removing activities', async () => {
		const error = new Error('Lookup failed');
		getByIds.mockRejectedValue(error);

		const context = {
			activitiesToSave: [],
			activitiesToRemove: [new Activity()],
			affectedIssueIds: []
		};

		await expect(removeStep.execute(context)).rejects.toBe(error);

		expect(remove).not.toHaveBeenCalled();
	});
});

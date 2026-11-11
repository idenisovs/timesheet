import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Activity } from '@entities';
import {
	ActivityRepositoryService
} from '@repository/activity-repository.service';
import {
	SaveActivitiesStepService
} from './save-activities-step.service';

describe('SaveActivitiesStepService', () => {
	let service: SaveActivitiesStepService;
	let save: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				SaveActivitiesStepService,
				{
					provide: ActivityRepositoryService,
					useValue: { save }
				}
			]
		});
		service = TestBed.inject(SaveActivitiesStepService);
	});

	it('saves the activities from the context', async () => {
		const activities = [new Activity()];

		const context = {
			activities: {
				toSave: activities,
				toRemove: [],
			},
			snapshots: {
				beforeSave: [],
				beforeRemove: [],
			},
			affectedIssues: [],
		};

		await service.execute(context);

		expect(save).toHaveBeenCalledExactlyOnceWith(activities);
	});
});

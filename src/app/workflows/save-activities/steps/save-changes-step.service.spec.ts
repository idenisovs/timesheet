import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Activity } from '@entities';
import {
	ActivityRepositoryService
} from '@repository/activity-repository.service';
import {
	SaveChangesStepService
} from './save-changes-step.service';

describe('SaveChangesStepService', () => {
	let service: SaveChangesStepService;
	let save: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				SaveChangesStepService,
				{
					provide: ActivityRepositoryService,
					useValue: { save }
				}
			]
		});
		service = TestBed.inject(SaveChangesStepService);
	});

	it('saves the activities from the context', async () => {
		const activities = [new Activity()];

		const context = {
			activities: {
				toSave: activities,
				toRemove: [],
			},
			changes: [],
			affectedIssues: [],
		};

		await service.execute(context);

		expect(save).toHaveBeenCalledExactlyOnceWith(activities);
	});
});

import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Activity } from '@entities';
import {
	ActivitiesRepositoryService
} from '@repository/activities-repository.service';
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
					provide: ActivitiesRepositoryService,
					useValue: { save }
				}
			]
		});
		service = TestBed.inject(SaveActivitiesStepService);
	});

	it('saves the activities from the context', async () => {
		const activities = [new Activity()];

		await service.execute({ activities, affectedIssueIds: [] });

		expect(save).toHaveBeenCalledExactlyOnceWith(activities);
	});
});

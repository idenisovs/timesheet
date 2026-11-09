import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	RelinkActivitiesStepService
} from './relink-activities-step.service';
import {
	SaveActivitiesWorkflowService
} from './save-activities-workflow.service';

describe('SaveActivitiesWorkflowService', () => {
	let service: SaveActivitiesWorkflowService;
	let relink: { execute: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		relink = { execute: vi.fn() };
		TestBed.configureTestingModule({
			providers: [
				SaveActivitiesWorkflowService,
				{ provide: RelinkActivitiesStepService, useValue: relink }
			]
		});
		service = TestBed.inject(SaveActivitiesWorkflowService);
	});

	it('passes activities to the relink step and returns its context', async () => {
		const activities: Activity[] = [];
		relink.execute.mockResolvedValue(undefined);

		const result = await service.run(activities);

		expect(relink.execute).toHaveBeenCalledExactlyOnceWith(result);
		expect(result.activities).toBe(activities);
	});

	it('propagates an error from the relink step', async () => {
		const error = new Error('Relinking failed');
		relink.execute.mockRejectedValue(error);

		await expect(service.run([])).rejects.toBe(error);
	});
});

import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { describe, expect, it, vi } from 'vitest';
import { SaveActivitiesWorkflowService } from './save-activities-workflow.service';
import {
	GetActivitySnapshotsStepService,
	SaveActivitiesStepService,
	SaveChangesStepService,
	UpdateAffectedIssuesStepService,
} from '@workflows/save-activities/steps';

describe('SaveActivitiesWorkflowService', () => {
	it('runs the steps in order with the same context', async () => {
		const steps = Array.from({ length: 4 }, () => ({ execute: vi.fn().mockResolvedValue(undefined) }));
		const types = [GetActivitySnapshotsStepService, SaveActivitiesStepService,
			SaveChangesStepService, UpdateAffectedIssuesStepService];
		TestBed.configureTestingModule({
			providers: [SaveActivitiesWorkflowService, ...types.map((provide, index) => ({ provide, useValue: steps[index] }))],
		});
		const toSave = [new Activity()];
		const toRemove = [new Activity()];
		const result = await TestBed.inject(SaveActivitiesWorkflowService).run(toSave, toRemove);

		for (const step of steps) {
			expect(step.execute).toHaveBeenCalledExactlyOnceWith(result);
		}

		for (let index = 0; index < steps.length - 1; index++) {
			expect(steps[index].execute).toHaveBeenCalledBefore(steps[index + 1].execute);
		}

		expect(result.activities).toEqual({ toSave, toRemove });
		expect(result.snapshots).toEqual([]);
	});
});

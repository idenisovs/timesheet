import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CalculateChangesStepService } from './steps/calculate-changes-step.service';
import { RelinkActivitiesStepService } from './steps/relink-activities-step.service';
import { GetAffectedIssuesStepService } from './steps/get-affected-issues-step.service';
import { SaveChangesStepService } from './steps/save-changes-step.service';
import { UpdateAffectedIssuesStepService } from './steps/update-affected-issues-step.service';
import { UpdateAffectedProjectsStepService } from './steps/update-affected-projects-step.service';
import { SaveActivitiesWorkflowService } from './save-activities-workflow.service';

describe('SaveActivitiesWorkflowService', () => {
	let service: SaveActivitiesWorkflowService;
	let calculateChanges: { execute: ReturnType<typeof vi.fn> };
	let relink: { execute: ReturnType<typeof vi.fn> };
	let getAffectedIssues: { execute: ReturnType<typeof vi.fn> };
	let save: { execute: ReturnType<typeof vi.fn> };
	let updateIssues: { execute: ReturnType<typeof vi.fn> };
	let updateProjects: { execute: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		calculateChanges = { execute: vi.fn().mockResolvedValue(undefined) };
		relink = { execute: vi.fn().mockResolvedValue(undefined) };
		getAffectedIssues = { execute: vi.fn().mockResolvedValue(undefined) };
		save = { execute: vi.fn().mockResolvedValue(undefined) };
		updateIssues = { execute: vi.fn().mockResolvedValue(undefined) };
		updateProjects = { execute: vi.fn().mockResolvedValue(undefined) };
		TestBed.configureTestingModule({
			providers: [
				SaveActivitiesWorkflowService,
				{ provide: RelinkActivitiesStepService, useValue: relink },
				{ provide: CalculateChangesStepService, useValue: calculateChanges },
				{ provide: GetAffectedIssuesStepService, useValue: getAffectedIssues },
				{ provide: SaveChangesStepService, useValue: save },
				{ provide: UpdateAffectedIssuesStepService, useValue: updateIssues },
				{ provide: UpdateAffectedProjectsStepService, useValue: updateProjects },
			],
		});
		service = TestBed.inject(SaveActivitiesWorkflowService);
	});

	it('runs each step in order with the same context', async () => {
		const activities = [new Activity()];
		const activitiesToRemove = [new Activity()];
		const result = await service.run(activities, activitiesToRemove);

		for (const step of [relink, calculateChanges, getAffectedIssues, save, updateIssues, updateProjects]) {
			expect(step.execute).toHaveBeenCalledExactlyOnceWith(result);
		}

		expect(result.activities.toSave).toBe(activities);
		expect(result.activities.toRemove).toBe(activitiesToRemove);
		expect(result.affectedIssues).toEqual([]);
		expect(relink.execute).toHaveBeenCalledBefore(calculateChanges.execute);
		expect(calculateChanges.execute).toHaveBeenCalledBefore(getAffectedIssues.execute);
		expect(save.execute).toHaveBeenCalledBefore(updateIssues.execute);
		expect(updateIssues.execute).toHaveBeenCalledBefore(updateProjects.execute);
	});

	it('propagates an error and does not run subsequent steps', async () => {
		const error = new Error('Saving failed');
		save.execute.mockRejectedValue(error);

		await expect(service.run([], [])).rejects.toBe(error);
		expect(relink.execute).toHaveBeenCalledOnce();
		expect(updateIssues.execute).not.toHaveBeenCalled();
		expect(updateProjects.execute).not.toHaveBeenCalled();
	});
});

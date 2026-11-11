import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RelinkActivitiesStepService } from './steps/relink-activities-step.service';
import { SaveActivitiesStepService } from './steps/save-activities-step.service';
import { UpdateAffectedIssuesStepService } from './steps/update-affected-issues-step.service';
import { UpdateAffectedProjectsStepService } from './steps/update-affected-projects-step.service';
import { SaveActivitiesWorkflowService } from './save-activities-workflow.service';

describe('SaveActivitiesWorkflowService', () => {
	let service: SaveActivitiesWorkflowService;
	let relink: { execute: ReturnType<typeof vi.fn> };
	let save: { execute: ReturnType<typeof vi.fn> };
	let updateIssues: { execute: ReturnType<typeof vi.fn> };
	let updateProjects: { execute: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		relink = { execute: vi.fn().mockResolvedValue(undefined) };
		save = { execute: vi.fn().mockResolvedValue(undefined) };
		updateIssues = { execute: vi.fn().mockResolvedValue(undefined) };
		updateProjects = { execute: vi.fn().mockResolvedValue(undefined) };
		TestBed.configureTestingModule({
			providers: [
				SaveActivitiesWorkflowService,
				{ provide: RelinkActivitiesStepService, useValue: relink },
				{ provide: SaveActivitiesStepService, useValue: save },
				{ provide: UpdateAffectedIssuesStepService, useValue: updateIssues },
				{ provide: UpdateAffectedProjectsStepService, useValue: updateProjects },
			],
		});
		service = TestBed.inject(SaveActivitiesWorkflowService);
	});

	it('runs each step in order with the same context', async () => {
		const activities = [new Activity()];
		const result = await service.run(activities);

		for (const step of [relink, save, updateIssues, updateProjects]) {
			expect(step.execute).toHaveBeenCalledExactlyOnceWith(result);
		}
		expect(result.activitiesToSave).toBe(activities);
		expect(result.affectedIssueIds).toEqual([]);
		expect(relink.execute).toHaveBeenCalledBefore(save.execute);
		expect(save.execute).toHaveBeenCalledBefore(updateIssues.execute);
		expect(updateIssues.execute).toHaveBeenCalledBefore(updateProjects.execute);
	});

	it('propagates an error and does not run subsequent steps', async () => {
		const error = new Error('Saving failed');
		save.execute.mockRejectedValue(error);

		await expect(service.run([])).rejects.toBe(error);
		expect(relink.execute).toHaveBeenCalledOnce();
		expect(updateIssues.execute).not.toHaveBeenCalled();
		expect(updateProjects.execute).not.toHaveBeenCalled();
	});
});

import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RelinkActivitiesStepService } from './steps/relink-activities-step.service';
import { GetActivitySnapshotsStepService } from './steps/get-activity-snapshots-step.service';
import { GetAffectedIssuesStepService } from './steps/get-affected-issues-step.service';
import { SaveActivitiesStepService } from './steps/save-activities-step.service';
import { RemoveActivitiesStepService } from './steps/remove-activities-step.service';
import { UpdateAffectedIssuesStepService } from './steps/update-affected-issues-step.service';
import { UpdateAffectedProjectsStepService } from './steps/update-affected-projects-step.service';
import { SaveActivitiesWorkflowService } from './save-activities-workflow.service';

describe('SaveActivitiesWorkflowService', () => {
	let service: SaveActivitiesWorkflowService;
	let getActivitySnapshots: { execute: ReturnType<typeof vi.fn> };
	let relink: { execute: ReturnType<typeof vi.fn> };
	let getAffectedIssues: { execute: ReturnType<typeof vi.fn> };
	let save: { execute: ReturnType<typeof vi.fn> };
	let remove: { execute: ReturnType<typeof vi.fn> };
	let updateIssues: { execute: ReturnType<typeof vi.fn> };
	let updateProjects: { execute: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		getActivitySnapshots = { execute: vi.fn().mockResolvedValue(undefined) };
		relink = { execute: vi.fn().mockResolvedValue(undefined) };
		getAffectedIssues = { execute: vi.fn().mockResolvedValue(undefined) };
		save = { execute: vi.fn().mockResolvedValue(undefined) };
		remove = { execute: vi.fn().mockResolvedValue(undefined) };
		updateIssues = { execute: vi.fn().mockResolvedValue(undefined) };
		updateProjects = { execute: vi.fn().mockResolvedValue(undefined) };
		TestBed.configureTestingModule({
			providers: [
				SaveActivitiesWorkflowService,
				{ provide: GetActivitySnapshotsStepService, useValue: getActivitySnapshots },
				{ provide: RelinkActivitiesStepService, useValue: relink },
				{ provide: GetAffectedIssuesStepService, useValue: getAffectedIssues },
				{ provide: SaveActivitiesStepService, useValue: save },
				{ provide: RemoveActivitiesStepService, useValue: remove },
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

		for (const step of [getActivitySnapshots, relink, save, remove, updateIssues, updateProjects]) {
			expect(step.execute).toHaveBeenCalledExactlyOnceWith(result);
		}

		expect(result.activities.toSave).toBe(activities);
		expect(result.activities.toRemove).toBe(activitiesToRemove);
		expect(result.snapshots.beforeSave).toEqual([]);
		expect(result.snapshots.beforeRemove).toEqual([]);
		expect(result.affectedIssueIds).toEqual(new Set());
		expect(getActivitySnapshots.execute).toHaveBeenCalledBefore(relink.execute);
		expect(save.execute).toHaveBeenCalledBefore(remove.execute);
		expect(remove.execute).toHaveBeenCalledBefore(updateIssues.execute);
		expect(updateIssues.execute).toHaveBeenCalledBefore(updateProjects.execute);
	});

	it('passes activities to remove to the remove step', async () => {
		const activitiesToRemove = [new Activity()];

		await service.run([], activitiesToRemove);

		expect(remove.execute).toHaveBeenCalledExactlyOnceWith(
			expect.objectContaining({ activities: expect.objectContaining({ toRemove: activitiesToRemove }) }),
		);
	});

	it('propagates an error and does not run subsequent steps', async () => {
		const error = new Error('Saving failed');
		save.execute.mockRejectedValue(error);

		await expect(service.run([], [])).rejects.toBe(error);
		expect(relink.execute).toHaveBeenCalledOnce();
		expect(remove.execute).not.toHaveBeenCalled();
		expect(updateIssues.execute).not.toHaveBeenCalled();
		expect(updateProjects.execute).not.toHaveBeenCalled();
	});
});

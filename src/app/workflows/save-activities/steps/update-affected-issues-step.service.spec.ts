import { TestBed } from '@angular/core/testing';
import { Activity, Issue } from '@entities';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { ActivitiesService } from '@services/activities.service';
import { SaveIssuesWorkflowService } from '@workflows/save-issues/save-issues-workflow.service';
import { describe, expect, it, vi } from 'vitest';
import { UpdateAffectedIssuesStepService } from './update-affected-issues-step.service';

describe('UpdateAffectedIssuesStepService', () => {
	it('recalculates issues from both sides of snapshots and saves them', async () => {
		const oldIssue = new Issue({ key: 'OLD-1' });
		const newIssue = new Issue({ key: 'NEW-1' });
		const getByKey = vi.fn().mockResolvedValueOnce(oldIssue).mockResolvedValueOnce(newIssue);
		const matching = new Activity();
		matching.name = 'NEW-1: work';
		const getByIssueKey = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([matching]);
		const calculateDuration = vi.fn().mockReturnValueOnce('0m').mockReturnValueOnce('1h');
		const run = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({ providers: [UpdateAffectedIssuesStepService,
			{ provide: IssueRepositoryService, useValue: { getByKey } },
			{ provide: ActivityRepositoryService, useValue: { getByIssueKey } },
			{ provide: ActivitiesService, useValue: { calculateDuration } },
			{ provide: SaveIssuesWorkflowService, useValue: { run } }] });
		const before = new Activity();
		before.name = 'OLD-1: work';
		const after = new Activity(before);
		after.name = 'NEW-1: work';

		await TestBed.inject(UpdateAffectedIssuesStepService).execute({
			activities: { toSave: [], toRemove: [] },
			snapshots: [{ before, after }, { before, after: null }],
		});

		expect(getByKey).toHaveBeenCalledWith('OLD-1');
		expect(getByKey).toHaveBeenCalledWith('NEW-1');
		expect(getByIssueKey).toHaveBeenCalledWith('OLD-1');
		expect(getByIssueKey).toHaveBeenCalledWith('NEW-1');
		expect(calculateDuration).toHaveBeenLastCalledWith([matching]);
		expect(oldIssue.activities).toBe(0);
		expect(oldIssue.duration).toBe('0m');
		expect(newIssue.activities).toBe(1);
		expect(newIssue.duration).toBe('1h');
		expect(run).toHaveBeenCalledExactlyOnceWith([oldIssue, newIssue], []);
	});
});

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
		const oldIssue = new Issue({ id: 'old' });
		const newIssue = new Issue({ id: 'new' });
		const getByIds = vi.fn().mockResolvedValue([oldIssue, newIssue]);
		const getByIssueId = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([new Activity()]);
		const calculateDuration = vi.fn().mockReturnValueOnce('0m').mockReturnValueOnce('1h');
		const run = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({ providers: [UpdateAffectedIssuesStepService,
			{ provide: IssueRepositoryService, useValue: { getByIds } },
			{ provide: ActivityRepositoryService, useValue: { getByIssueId } },
			{ provide: ActivitiesService, useValue: { calculateDuration } },
			{ provide: SaveIssuesWorkflowService, useValue: { run } }] });
		const before = new Activity();
		before.issueId = 'old';
		const after = new Activity(before);
		after.issueId = 'new';

		await TestBed.inject(UpdateAffectedIssuesStepService).execute({
			activities: { toSave: [], toRemove: [] },
			snapshots: [{ before, after }, { before, after: null }], affectedIssues: [],
		});

		expect(getByIds).toHaveBeenCalledExactlyOnceWith(['old', 'new']);
		expect(oldIssue.activities).toBe(0);
		expect(oldIssue.duration).toBe('0m');
		expect(newIssue.activities).toBe(1);
		expect(newIssue.duration).toBe('1h');
		expect(run).toHaveBeenCalledExactlyOnceWith([oldIssue, newIssue], []);
	});
});

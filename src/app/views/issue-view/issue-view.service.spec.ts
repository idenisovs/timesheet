import { TestBed } from '@angular/core/testing';
import { Activity, Issue } from '@entities';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { SaveIssuesWorkflowService } from '@workflows/save-issues/save-issues-workflow.service';
import { describe, expect, it, vi } from 'vitest';
import { IssueViewService } from './issue-view.service';

describe('IssueViewService', () => {
	it('removes related activities before removing the issue through the workflow', async () => {
		const activities = [new Activity()];
		const getByIssueKey = vi.fn().mockResolvedValue(activities);
		const remove = vi.fn().mockResolvedValue(undefined);
		const run = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				IssueViewService,
				{ provide: ActivityRepositoryService, useValue: { getByIssueKey, remove } },
				{ provide: SaveIssuesWorkflowService, useValue: { run } },
			],
		});
		const issue = new Issue({ key: 'ABC-1' });

		await TestBed.inject(IssueViewService).remove(issue);

		expect(getByIssueKey).toHaveBeenCalledExactlyOnceWith('ABC-1');
		expect(remove).toHaveBeenCalledExactlyOnceWith(activities);
		expect(run).toHaveBeenCalledExactlyOnceWith([], [issue]);
		expect(remove).toHaveBeenCalledBefore(run);
	});
});

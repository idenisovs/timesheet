import { TestBed } from '@angular/core/testing';
import { Activity, Issue } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { RelinkActivitiesStepService } from './relink-activities-step.service';

describe('RelinkActivitiesStepService', () => {
	it('links activities to existing and newly created issues and unlinks removed keys', async () => {
		const existingIssue = new Issue({ key: 'ABC-1' });
		const getByKey = vi.fn(async (key: string) => key === 'ABC-1' ? existingIssue : null);
		const create = vi.fn(async (issue: Issue) => issue);
		TestBed.configureTestingModule({ providers: [RelinkActivitiesStepService,
			{ provide: IssueRepositoryService, useValue: { getByKey, create } }] });
		const existing = new Activity();
		existing.name = 'ABC-1: Work';
		const created = new Activity();
		created.name = 'NEW-2: New work';
		const unlinked = new Activity();
		unlinked.issueId = 'old';

		await TestBed.inject(RelinkActivitiesStepService).execute({
			activities: { toSave: [existing, created, unlinked], toRemove: [] },
			snapshots: [],
		});

		expect(existing.issueId).toBe(existingIssue.id);
		expect(create).toHaveBeenCalledOnce();
		const createdIssue = create.mock.calls[0][0];
		expect(createdIssue.key).toBe('NEW-2');
		expect(created.issueId).toBe(createdIssue.id);
		expect(unlinked.issueId).toBeUndefined();
	});
});

import { TestBed } from '@angular/core/testing';
import { Activity, Issue } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetAffectedIssuesStepService } from './get-affected-issues-step.service';

describe('GetAffectedIssuesStepService', () => {
	let getAffectedIssuesStep: GetAffectedIssuesStepService;
	let getByIds: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getByIds = vi.fn();
		TestBed.configureTestingModule({
			providers: [
				GetAffectedIssuesStepService,
				{ provide: IssueRepositoryService, useValue: { getByIds } },
			],
		});
		getAffectedIssuesStep = TestBed.inject(GetAffectedIssuesStepService);
	});

	it('collects unique issue IDs from activities', async () => {
		const toSave = new Activity();
		toSave.issueId = 'new-issue';
		const toRemove = new Activity();
		toRemove.issueId = 'requested-issue';
		const duplicate = new Activity();
		duplicate.issueId = 'old-issue';
		const unlinked = new Activity();
		const issues = [new Issue({ id: 'old-issue' }), new Issue({ id: 'new-issue' })];
		getByIds.mockResolvedValue(issues);
		const context = {
			activities: {
				toSave: [toSave, duplicate, unlinked],
				toRemove: [toRemove],
			},
			changes: [],
			affectedIssues: [] as Issue[],
		};

		await getAffectedIssuesStep.execute(context);

		expect(getByIds).toHaveBeenCalledExactlyOnceWith([
			'new-issue', 'old-issue', 'requested-issue',
		]);
		expect(context.affectedIssues).toBe(issues);
	});
});

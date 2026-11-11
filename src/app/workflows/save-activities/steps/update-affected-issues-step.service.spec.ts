import { TestBed } from '@angular/core/testing';
import { Activity, Issue } from '@entities';
import { ActivitiesRepositoryService } from '@repository/activities-repository.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { ActivitiesService } from '@services/activities.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateAffectedIssuesStepService } from './update-affected-issues-step.service';

describe('UpdateAffectedIssuesStepService', () => {
	let service: UpdateAffectedIssuesStepService;
	let getByIds: ReturnType<typeof vi.fn>;
	let getByIssueId: ReturnType<typeof vi.fn>;
	let bulkUpdate: ReturnType<typeof vi.fn>;
	let calculateDuration: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getByIds = vi.fn();
		getByIssueId = vi.fn();
		bulkUpdate = vi.fn().mockResolvedValue(undefined);
		calculateDuration = vi.fn();
		TestBed.configureTestingModule({
			providers: [
				UpdateAffectedIssuesStepService,
				{ provide: IssueRepositoryService, useValue: { getByIds, bulkUpdate } },
				{ provide: ActivitiesRepositoryService, useValue: { getByIssueId } },
				{ provide: ActivitiesService, useValue: { calculateDuration } },
			],
		});
		service = TestBed.inject(UpdateAffectedIssuesStepService);
	});

	it('recalculates and saves counts and durations for all affected issues', async () => {
		const issues = [new Issue({ id: 'old', activities: 3 }), new Issue({ id: 'new' })];
		const activities = [new Activity(), new Activity()];
		getByIds.mockResolvedValue(issues);
		getByIssueId.mockResolvedValueOnce([]).mockResolvedValueOnce(activities);
		calculateDuration.mockReturnValueOnce('0m').mockReturnValueOnce('2h');

		await service.execute({ activitiesToSave: [], activitiesToRemove: [], affectedIssueIds: ['old', 'new'] });

		expect(getByIds).toHaveBeenCalledExactlyOnceWith(['old', 'new']);
		expect(getByIssueId.mock.calls).toEqual([['old'], ['new']]);
		expect(calculateDuration.mock.calls).toEqual([[[]], [activities]]);
		expect(issues.map(issue => [issue.activities, issue.duration])).toEqual([[0, '0m'], [2, '2h']]);
		expect(bulkUpdate).toHaveBeenCalledExactlyOnceWith(issues);
	});
});

import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Activity } from '@entities';
import {
	IssueRepositoryService
} from '@repository/issue-repository.service';
import {
	RelinkActivitiesStepService
} from './relink-activities-step.service';

describe('RelinkActivitiesStepService', () => {
	let service: RelinkActivitiesStepService;
	const getByKey = vi.fn();
	const create = vi.fn();

	beforeEach(() => {
		getByKey.mockReset();
		create.mockReset();
		TestBed.configureTestingModule({
			providers: [
				RelinkActivitiesStepService,
				{
					provide: IssueRepositoryService,
					useValue: { getByKey, create }
				}
			]
		});
		service = TestBed.inject(RelinkActivitiesStepService);
	});

	it('creates a missing issue and links the activity to it', async () => {
		const activity = new Activity();
		activity.name = 'ABC-123: Work';
		getByKey.mockResolvedValue(null);
		create.mockImplementation(async issue => issue);
		const context = { activitiesToSave: [activity], activitiesToRemove: [], affectedIssueIds: [] as string[] };

		await service.execute(context);

		const issue = create.mock.calls[0][0];
		expect(issue.key).toBe('ABC-123');
		expect(issue.name).toBe('Work');
		expect(activity.issueId).toBe(issue.id);
		expect(context.affectedIssueIds).toEqual([issue.id]);
	});

	it('keeps an existing matching issue link without creating an issue', async () => {
		const activity = new Activity();
		activity.name = 'ABC-123: Work';
		activity.issueId = 'existing';
		getByKey.mockResolvedValue({ id: 'existing' });
		const context = { activitiesToSave: [activity], activitiesToRemove: [], affectedIssueIds: [] as string[] };

		await service.execute(context);

		expect(activity.issueId).toBe('existing');
		expect(context.affectedIssueIds).toEqual(['existing']);
		expect(create).not.toHaveBeenCalled();
	});

	it('records unique issue IDs before and after relinking', async () => {
		const relinked = new Activity();
		relinked.name = 'ABC-123: Work';
		relinked.issueId = 'old-id';
		const unlinked = new Activity();
		unlinked.issueId = 'old-id';
		const unrelated = new Activity();
		getByKey.mockResolvedValue({ id: 'new-id' });
		const context = {
			activitiesToSave: [relinked, unlinked, unrelated],
			activitiesToRemove: [], affectedIssueIds: [] as string[]
		};

		await service.execute(context);

		expect(context.affectedIssueIds).toEqual(['old-id', 'new-id']);
		expect(relinked.issueId).toBe('new-id');
		expect(unlinked.issueId).toBeUndefined();
	});
});

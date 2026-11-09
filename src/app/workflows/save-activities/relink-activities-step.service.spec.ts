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

	beforeEach(() => {
		getByKey.mockReset();
		TestBed.configureTestingModule({
			providers: [
				RelinkActivitiesStepService,
				{
					provide: IssueRepositoryService,
					useValue: { getByKey }
				}
			]
		});
		service = TestBed.inject(RelinkActivitiesStepService);
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
			activities: [relinked, unlinked, unrelated],
			affectedIssueIds: [] as string[]
		};

		await service.execute(context);

		expect(context.affectedIssueIds).toEqual(['old-id', 'new-id']);
		expect(relinked.issueId).toBe('new-id');
		expect(unlinked.issueId).toBeUndefined();
	});
});

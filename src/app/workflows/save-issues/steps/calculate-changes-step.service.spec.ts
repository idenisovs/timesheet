import { TestBed } from '@angular/core/testing';
import { Change, Issue } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { CalculateChangesStepService } from './calculate-changes-step.service';

describe('CalculateChangesStepService', () => {
	it('calculates changes for new, updated, and removed issues', async () => {
		const original = new Issue({ name: 'Original' });
		const updated = new Issue({ ...original, name: 'Updated' });
		const unchanged = new Issue({ name: 'Unchanged' });
		const created = new Issue({ name: 'New' });
		const removed = new Issue({ name: 'Removed' });
		const getByIds = vi.fn().mockResolvedValue([original, unchanged]);
		TestBed.configureTestingModule({
			providers: [
				CalculateChangesStepService,
				{ provide: IssueRepositoryService, useValue: { getByIds } },
			],
		});
		const context = {
			issues: { toSave: [updated, unchanged, created], toRemove: [removed] },
			changes: [] as Change[],
			affectedProjects: [],
		};

		await TestBed.inject(CalculateChangesStepService).execute(context);

		expect(getByIds).toHaveBeenCalledExactlyOnceWith([updated.id, unchanged.id, created.id]);
		expect(context.changes).toEqual([
			expect.objectContaining({ entity: 'issue', before: original, after: updated }),
			expect.objectContaining({ entity: 'issue', before: null, after: created }),
			expect.objectContaining({ entity: 'issue', before: removed, after: null }),
		]);
	});
});

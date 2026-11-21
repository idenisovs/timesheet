import { TestBed } from '@angular/core/testing';
import { Issue } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { GetIssueSnapshotsStepService } from './get-issue-snapshots-step.service';

describe('GetIssueSnapshotsStepService', () => {
	it('captures new, changed and removed issues, skipping unchanged ones', async () => {
		const original = new Issue({ name: 'Original' });
		original.createdAt = new Date('2020-01-01');
		original.updatedAt = new Date('2020-01-02');
		const updated = new Issue({ ...original, name: 'Updated' });
		const unchanged = new Issue();
		const created = new Issue();
		const removed = new Issue();
		const getById = vi.fn().mockResolvedValueOnce(original).mockResolvedValueOnce(unchanged).mockResolvedValueOnce(null);
		TestBed.configureTestingModule({
			providers: [GetIssueSnapshotsStepService, { provide: IssueRepositoryService, useValue: { getById } }],
		});
		const context = {
			issues: { toSave: [updated, unchanged, created], toRemove: [removed] },
			changes: [],
			snapshots: [],
		};

		await TestBed.inject(GetIssueSnapshotsStepService).execute(context);

		expect(context.snapshots).toEqual([
			{ before: original, after: updated },
			{ before: null, after: created },
			{ before: removed, after: null },
		]);
	});
});

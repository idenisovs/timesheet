import { TestBed } from '@angular/core/testing';
import { Issue } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { TimestampsStepService } from './timestamps-step.service';

describe('TimestampsStepService for issues', () => {
	it('updates existing records and leaves new and removed records alone', async () => {
		const oldDate = new Date('2020-01-01T00:00:00Z');
		const original = new Issue();
		original.createdAt = oldDate;
		original.updatedAt = oldDate;
		const changed = new Issue(original);
		changed.name = 'Changed';
		const unchanged = new Issue();
		unchanged.updatedAt = oldDate;
		const created = new Issue();
		created.createdAt = oldDate;
		created.updatedAt = oldDate;
		const removed = new Issue();
		removed.updatedAt = oldDate;
		const getById = vi.fn(async (id: string) => {
			if (id === original.id) {
				return original;
			}
			if (id === unchanged.id) {
				return unchanged;
			}
			return null;
		});
		TestBed.configureTestingModule({
			providers: [TimestampsStepService, { provide: IssueRepositoryService, useValue: { getById } }],
		});
		const context = { issues: { toSave: [changed, unchanged, created], toRemove: [removed] }, snapshots: [] };
		const before = Date.now();

		await TestBed.inject(TimestampsStepService).execute(context);

		expect(changed.createdAt).toEqual(oldDate);
		expect(changed.updatedAt.getTime()).toBeGreaterThanOrEqual(before);
		expect(created.createdAt).toEqual(oldDate);
		expect(created.updatedAt).toEqual(oldDate);
		expect(unchanged.updatedAt.getTime()).toBeGreaterThanOrEqual(before);
		expect(removed.updatedAt).toEqual(oldDate);
	});
});

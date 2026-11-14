import { TestBed } from '@angular/core/testing';
import { Issue } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveIssuesWorkflowService } from './save-issues-workflow.service';
import { UpdateAffectedProjectsStepService } from './steps';

describe('SaveIssuesWorkflowService', () => {
	it('saves and records created, changed and removed issues and skips unchanged ones', async () => {
		const original = new Issue({ name: 'Original' });
		const updated = new Issue({ ...original, name: 'Updated' });
		const unchanged = new Issue({ name: 'Unchanged' });
		const created = new Issue({ name: 'Created' });
		const removed = new Issue({ name: 'Removed' });
		const getById = vi.fn(async (id: string) => {
			if (id === original.id) {
				return original;
			}

			if (id === unchanged.id) {
				return unchanged;
			}

			return null;
		});
		const create = vi.fn().mockResolvedValue(undefined);
		const update = vi.fn().mockResolvedValue(undefined);
		const remove = vi.fn().mockResolvedValue(undefined);
		const save = vi.fn().mockResolvedValue(undefined);
		const updateProjects = { execute: vi.fn().mockResolvedValue(undefined) };
		TestBed.configureTestingModule({
			providers: [
				SaveIssuesWorkflowService,
				{ provide: IssueRepositoryService, useValue: { getById, create, update, remove } },
				{ provide: ChangeRepositoryService, useValue: { save } },
				{ provide: UpdateAffectedProjectsStepService, useValue: updateProjects },
			],
		});

		const result = await TestBed.inject(SaveIssuesWorkflowService)
			.run([updated, unchanged, created], [removed]);

		expect(update).toHaveBeenCalledExactlyOnceWith(updated);
		expect(create).toHaveBeenCalledExactlyOnceWith(created);
		expect(remove).toHaveBeenCalledExactlyOnceWith(removed);
		expect(result.snapshots).toEqual([
			{ before: original, after: updated },
			{ before: null, after: created },
			{ before: removed, after: null },
		]);
		expect(save).toHaveBeenCalledExactlyOnceWith([
			expect.objectContaining({ entity: 'issue', before: original, after: updated }),
			expect.objectContaining({ entity: 'issue', before: null, after: created }),
			expect.objectContaining({ entity: 'issue', before: removed, after: null }),
		]);
		expect(updateProjects.execute).toHaveBeenCalledExactlyOnceWith(result);
	});
});

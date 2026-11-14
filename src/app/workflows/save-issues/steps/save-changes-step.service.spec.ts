import { TestBed } from '@angular/core/testing';
import { Change, Issue } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveChangesStepService } from './save-changes-step.service';

describe('SaveChangesStepService', () => {
	it('saves and removes issues and records their changes', async () => {
		const update = vi.fn().mockResolvedValue(undefined);
		const remove = vi.fn().mockResolvedValue(undefined);
		const save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				SaveChangesStepService,
				{ provide: IssueRepositoryService, useValue: { update, remove } },
				{ provide: ChangeRepositoryService, useValue: { save } },
			],
		});
		const updated = new Issue();
		const removed = new Issue();
		const updateChange = new Change({ entity: 'issue', after: updated });
		const removeChange = new Change({ entity: 'issue', before: removed });

		await TestBed.inject(SaveChangesStepService).execute({
			issues: { toSave: [], toRemove: [] },
			changes: [updateChange, removeChange],
			affectedProjects: [],
		});

		expect(update).toHaveBeenCalledExactlyOnceWith(updated);
		expect(remove).toHaveBeenCalledExactlyOnceWith(removed);
		expect(save).toHaveBeenNthCalledWith(1, [updateChange]);
		expect(save).toHaveBeenNthCalledWith(2, [removeChange]);
	});
});

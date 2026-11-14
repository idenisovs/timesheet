import { TestBed } from '@angular/core/testing';
import { Project } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveProjectsWorkflowService } from './save-projects-workflow.service';

describe('SaveProjectsWorkflowService', () => {
	it('saves project creations, updates and removals while skipping unchanged projects', async () => {
		const original = new Project();
		original.name = 'Original';
		const updated = new Project(original);
		updated.name = 'Updated';
		const unchanged = new Project();
		const created = new Project();
		const removed = new Project();
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
		TestBed.configureTestingModule({
			providers: [
				SaveProjectsWorkflowService,
				{ provide: ProjectRepositoryService, useValue: { getById, create, update, remove } },
				{ provide: ChangeRepositoryService, useValue: { save } },
			],
		});

		const result = await TestBed.inject(SaveProjectsWorkflowService)
			.run([updated, unchanged, created], [removed]);

		expect(create).toHaveBeenCalledExactlyOnceWith(created);
		expect(update).toHaveBeenCalledExactlyOnceWith(updated);
		expect(remove).toHaveBeenCalledExactlyOnceWith(removed);
		expect(result.snapshots).toEqual([
			expect.objectContaining({ before: original, after: updated }),
			expect.objectContaining({ before: null, after: created }),
			expect.objectContaining({ before: removed, after: null }),
		]);
		expect(save).toHaveBeenCalledExactlyOnceWith([
			expect.objectContaining({ entity: 'project', before: original, after: updated }),
			expect.objectContaining({ entity: 'project', before: null, after: created }),
			expect.objectContaining({ entity: 'project', before: removed, after: null }),
		]);
	});
});

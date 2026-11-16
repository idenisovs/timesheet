import { TestBed } from '@angular/core/testing';
import { Project } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveChangesStepService } from './save-changes-step.service';

describe('SaveChangesStepService', () => {
	it('records project IDs for created, updated and removed projects', async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [SaveChangesStepService, { provide: ChangeRepositoryService, useValue: { save } }],
		});
		const before = new Project();
		const after = new Project();
		after.id = before.id;
		const removed = new Project();
		const created = new Project();

		await TestBed.inject(SaveChangesStepService).execute({
			projects: { toSave: [], toRemove: [] },
			snapshots: [{ before, after }, { before: removed, after: null }, { before: null, after: created }],
		});

		expect(save).toHaveBeenCalledExactlyOnceWith([
			expect.objectContaining({ entity: 'project', entityId: after.id, before, after }),
			expect.objectContaining({ entity: 'project', entityId: removed.id, before: removed, after: null }),
			expect.objectContaining({ entity: 'project', entityId: created.id, before: null, after: created }),
		]);
	});
});

import { TestBed } from '@angular/core/testing';
import { Issue } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveChangesStepService } from './save-changes-step.service';

describe('SaveChangesStepService', () => {
	it('records issue snapshots as changes', async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [SaveChangesStepService, { provide: ChangeRepositoryService, useValue: { save } }],
		});
		const before = new Issue();
		const after = new Issue({ ...before, name: 'Updated' });
		const removed = new Issue();
		const context = {
			issues: { toSave: [], toRemove: [] },
			snapshots: [{ before, after }, { before: removed, after: null }],
		};

		await TestBed.inject(SaveChangesStepService).execute(context);

		expect(save).toHaveBeenCalledExactlyOnceWith([
			expect.objectContaining({ entity: 'issue', before, after }),
			expect.objectContaining({ entity: 'issue', before: removed, after: null }),
		]);
	});
});

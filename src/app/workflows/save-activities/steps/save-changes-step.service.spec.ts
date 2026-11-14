import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveChangesStepService } from './save-changes-step.service';

describe('SaveChangesStepService', () => {
	it('records each activity snapshot as a change', async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({ providers: [SaveChangesStepService,
			{ provide: ChangeRepositoryService, useValue: { save } }] });
		const before = new Activity();
		const after = new Activity(before);
		const removed = new Activity();

		await TestBed.inject(SaveChangesStepService).execute({
			activities: { toSave: [], toRemove: [] },
			snapshots: [{ before, after }, { before: removed, after: null }],
			affectedIssues: [],
		});

		expect(save).toHaveBeenCalledExactlyOnceWith([
			expect.objectContaining({ entity: 'activity', before, after }),
			expect.objectContaining({ entity: 'activity', before: removed, after: null }),
		]);
	});
});

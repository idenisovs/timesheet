import { TestBed } from '@angular/core/testing';
import { Activity } from '@entities';
import { ChangeRepositoryService } from '@repository/change-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { SaveActivityChangesStepService } from './save-activity-changes-step.service';

describe('SaveActivityChangesStepService', () => {
	it('records activity creations, updates, and removals using snapshots', async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				SaveActivityChangesStepService,
				{ provide: ChangeRepositoryService, useValue: { save } },
			],
		});
		const service = TestBed.inject(SaveActivityChangesStepService);
		const original = new Activity();
		const updated = new Activity(original);
		updated.name = 'Updated';
		const created = new Activity();
		const removed = new Activity();

		await service.execute({
			activities: { toSave: [updated, created], toRemove: [removed] },
			snapshots: { beforeSave: [original], beforeRemove: [removed] },
			affectedIssues: [],
		});

		expect(save).toHaveBeenCalledExactlyOnceWith([
			expect.objectContaining({ entity: 'activity', before: original, after: updated, syncedAt: null }),
			expect.objectContaining({ entity: 'activity', before: null, after: created, syncedAt: null }),
			expect.objectContaining({ entity: 'activity', before: removed, after: null, syncedAt: null }),
		]);
	});
});

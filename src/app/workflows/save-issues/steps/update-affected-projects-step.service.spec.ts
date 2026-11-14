import { TestBed } from '@angular/core/testing';
import { Change, Issue, Project } from '@entities';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { describe, expect, it, vi } from 'vitest';
import { UpdateAffectedProjectsStepService } from './update-affected-projects-step.service';

describe('UpdateAffectedProjectsStepService', () => {
	it('updates projects from both sides of issue changes', async () => {
		const project = new Project();
		const getAllByKeys = vi.fn().mockResolvedValue([project]);
		const update = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				UpdateAffectedProjectsStepService,
				{ provide: ProjectRepositoryService, useValue: { getAllByKeys, update } },
			],
		});
		const before = new Issue({ key: 'OLD-1' });
		const after = new Issue({ key: 'NEW-1' });
		const context = {
			issues: { toSave: [after], toRemove: [] },
			changes: [new Change({ entity: 'issue', before, after })],
			affectedProjects: [] as Project[],
		};

		await TestBed.inject(UpdateAffectedProjectsStepService).execute(context);

		expect(getAllByKeys).toHaveBeenCalledExactlyOnceWith(['OLD', 'NEW']);
		expect(update).toHaveBeenCalledExactlyOnceWith(project);
		expect(context.affectedProjects).toEqual([project]);
	});
});

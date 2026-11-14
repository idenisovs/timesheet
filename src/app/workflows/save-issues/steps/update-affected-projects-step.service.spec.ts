import { TestBed } from '@angular/core/testing';
import { Issue, Project } from '@entities';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { SaveProjectsWorkflowService } from '@workflows/save-projects/save-projects-workflow.service';
import { describe, expect, it, vi } from 'vitest';
import { UpdateAffectedProjectsStepService } from './update-affected-projects-step.service';

describe('UpdateAffectedProjectsStepService', () => {
	it('passes projects from both sides of issue snapshots to the save workflow', async () => {
		const project = new Project();
		const getAllByKeys = vi.fn().mockResolvedValue([project]);
		const run = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				UpdateAffectedProjectsStepService,
				{ provide: ProjectRepositoryService, useValue: { getAllByKeys } },
				{ provide: SaveProjectsWorkflowService, useValue: { run } },
			],
		});
		const before = new Issue({ key: 'OLD-1' });
		const after = new Issue({ key: 'NEW-1' });

		await TestBed.inject(UpdateAffectedProjectsStepService).execute({
			issues: { toSave: [after], toRemove: [] },
			snapshots: [{ before, after }, { before, after: null }],
		});

		expect(getAllByKeys).toHaveBeenCalledExactlyOnceWith(['OLD', 'NEW']);
		expect(run).toHaveBeenCalledExactlyOnceWith([project], []);
	});
});

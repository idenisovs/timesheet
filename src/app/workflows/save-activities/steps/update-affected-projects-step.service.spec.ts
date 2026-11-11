import { TestBed } from '@angular/core/testing';
import { Issue, Project } from '@entities';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateAffectedProjectsStepService } from './update-affected-projects-step.service';

describe('UpdateAffectedProjectsStepService', () => {
	let service: UpdateAffectedProjectsStepService;
	let getByIds: ReturnType<typeof vi.fn>;
	let getAllByKeys: ReturnType<typeof vi.fn>;
	let update: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		getByIds = vi.fn();
		getAllByKeys = vi.fn();
		update = vi.fn().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				UpdateAffectedProjectsStepService,
				{ provide: IssueRepositoryService, useValue: { getByIds } },
				{ provide: ProjectRepositoryService, useValue: { getAllByKeys, update } },
			],
		});
		service = TestBed.inject(UpdateAffectedProjectsStepService);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('updates each matching project using unique affected issue prefixes', async () => {
		const now = new Date('2026-01-02T12:00:00Z');
		vi.useFakeTimers();
		vi.setSystemTime(now);
		const projects = [new Project(), new Project()];
		getByIds.mockResolvedValue([
			new Issue({ key: 'ABC-1' }),
			new Issue({ key: 'ABC-2' }),
			new Issue({ key: 'XYZ-1' }),
		]);
		getAllByKeys.mockResolvedValue(projects);

		const context = {
			activities: {
				toSave: [],
				toRemove: [],
			},
			snapshots: {
				beforeSave: [],
				beforeRemove: [],
			},
			affectedIssueIds: new Set<string>(['one', 'two', 'three']),
		};

		await service.execute(context);

		expect(getByIds).toHaveBeenCalledExactlyOnceWith(['one', 'two', 'three']);
		expect(getAllByKeys).toHaveBeenCalledExactlyOnceWith(['ABC', 'XYZ']);
		expect(update.mock.calls).toEqual([[projects[0]], [projects[1]]]);
		expect(projects.map(project => project.updatedAt)).toEqual([now, now]);
	});
});

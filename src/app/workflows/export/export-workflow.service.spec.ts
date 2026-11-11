import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { ExportWorkflowService } from './export-workflow.service';
import { WriteExportStepService } from './steps/write-export-step.service';

describe('ExportWorkflowService', () => {
	const issue = {
		id: 'issue-1',
		createdAt: new Date('2025-01-01T00:00:00.000Z'),
		activities: [{ id: 'activity-1' }],
	};
	const activityRepository = { getAll: vi.fn() };
	const issueRepository = { getAll: vi.fn() };
	const projectRepository = { getAll: vi.fn() };
	const write = { execute: vi.fn() };
	let service: ExportWorkflowService;

	beforeEach(() => {
		activityRepository.getAll.mockReset().mockResolvedValue([{ id: 'activity-1', date: '2025-01-01' }]);
		issueRepository.getAll.mockReset().mockResolvedValue([issue]);
		projectRepository.getAll.mockReset().mockResolvedValue([{
			id: 'project-1',
			createdAt: new Date('2025-01-01T00:00:00.000Z'),
			updatedAt: new Date('2025-01-02T00:00:00.000Z'),
			keys: ['A', 'B'],
		}]);
		write.execute.mockReset().mockResolvedValue(undefined);
		TestBed.configureTestingModule({
			providers: [
				ExportWorkflowService,
				{ provide: ActivityRepositoryService, useValue: activityRepository },
				{ provide: IssueRepositoryService, useValue: issueRepository },
				{ provide: ProjectRepositoryService, useValue: projectRepository },
				{ provide: WriteExportStepService, useValue: write },
			],
		});
		service = TestBed.inject(ExportWorkflowService);
	});

	it('builds all sheets before writing the workbook', async () => {
		const context = await service.run();
		const workbook = context.workbook;
		expect(write.execute).toHaveBeenCalledExactlyOnceWith(context);
		expect(workbook.SheetNames).toEqual(['Activities', 'Issues', 'Projects', 'Metadata']);
		expect(XLSX.utils.sheet_to_json(workbook.Sheets['Activities'])).toEqual([
			{ id: 'activity-1', date: '2025-01-01' },
		]);
		expect(XLSX.utils.sheet_to_json(workbook.Sheets['Issues'])).toEqual([
			{ id: 'issue-1', createdAt: '2025-01-01T00:00:00.000Z' },
		]);
		expect(issue.activities).toEqual([{ id: 'activity-1' }]);
		expect(XLSX.utils.sheet_to_json(workbook.Sheets['Projects'])).toEqual([{
			id: 'project-1',
			createdAt: '2025-01-01T00:00:00.000Z',
			updatedAt: '2025-01-02T00:00:00.000Z',
			keys: 'A;B',
		}]);
		expect(XLSX.utils.sheet_to_json(workbook.Sheets['Metadata'])).toEqual([
			{ type: 'activities', version: 1 },
			{ type: 'issues', version: 1 },
			{ type: 'projects', version: 1 },
		]);
	});

	it('does not write the workbook if a repository fails', async () => {
		const error = new Error('Could not load issues');
		issueRepository.getAll.mockRejectedValue(error);

		await expect(service.run()).rejects.toBe(error);
		expect(projectRepository.getAll).not.toHaveBeenCalled();
		expect(write.execute).not.toHaveBeenCalled();
	});
});

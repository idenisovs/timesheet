import { inject, Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { ProjectRepositoryService } from '@repository/project-repository.service';
import { ExportContext } from '@workflows/export/export-context';
import { Step } from '@workflows/Step';

@Service()
export class ExportProjectsStepService implements Step<ExportContext> {
	private readonly projectsRepository = inject(ProjectRepositoryService);

	async execute(context: ExportContext): Promise<void> {
		const projects = await this.projectsRepository.getAll();
		const projectsJson = projects.map(project => ({
			...project,
			createdAt: project.createdAt.toISOString(),
			updatedAt: project.updatedAt.toISOString(),
			keys: project.keys.join(';'),
		}));
		const sheet = XLSX.utils.json_to_sheet(projectsJson);
		XLSX.utils.book_append_sheet(context.workbook, sheet, 'Projects');
	}
}

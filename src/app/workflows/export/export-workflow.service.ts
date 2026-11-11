import { inject, Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { Workflow } from '@workflows/Workflow';
import { ExportContext } from '@workflows/export/export-context';
import { ExportActivitiesStepService } from '@workflows/export/steps/export-activities-step.service';
import { ExportIssuesStepService } from '@workflows/export/steps/export-issues-step.service';
import { ExportProjectsStepService } from '@workflows/export/steps/export-projects-step.service';
import { ExportMetadataStepService } from '@workflows/export/steps/export-metadata-step.service';
import { WriteExportStepService } from '@workflows/export/steps/write-export-step.service';

@Service()
export class ExportWorkflowService {
	private readonly activities = inject(ExportActivitiesStepService);
	private readonly issues = inject(ExportIssuesStepService);
	private readonly projects = inject(ExportProjectsStepService);
	private readonly metadata = inject(ExportMetadataStepService);
	private readonly write = inject(WriteExportStepService);

	private readonly workflow = new Workflow<ExportContext>([
		this.activities,
		this.issues,
		this.projects,
		this.metadata,
		this.write,
	]);

	public run() {
		return this.workflow.run({ workbook: XLSX.utils.book_new() });
	}
}

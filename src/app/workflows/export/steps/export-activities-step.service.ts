import { inject, Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { ActivityRepositoryService } from '@repository/activity-repository.service';
import { ExportContext } from '@workflows/export/export-context';
import { Step } from '@workflows/Step';

@Service()
export class ExportActivitiesStepService implements Step<ExportContext> {
	private readonly activitiesRepository = inject(ActivityRepositoryService);

	async execute(context: ExportContext): Promise<void> {
		const activities = await this.activitiesRepository.getAll();
		const activitiesJson = activities.map(activity => ({
			...activity,
			date: activity.date,
		}));
		const sheet = XLSX.utils.json_to_sheet(activitiesJson);
		XLSX.utils.book_append_sheet(context.workbook, sheet, 'Activities');
	}
}

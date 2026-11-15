import { inject, Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { DateTime } from 'luxon';
import {
	ActivityRepositoryService,
} from '@repository/activity-repository.service';
import { ExportContext } from '@workflows/export/export-context';
import { Step } from '@workflows/Step';
import { Activity } from '@entities';

@Service()
export class ExportActivitiesStepService implements Step<ExportContext> {
	private readonly activitiesRepository = inject(ActivityRepositoryService);

	async execute(context: ExportContext): Promise<void> {
		const activities = await this.activitiesRepository.getAll() as Activity[];

		const activitiesJson = activities.map((activity: Activity) => ({
			id: activity.id,
			name: activity.name,
			date: this.getDateString(activity.date),
			from: activity.from,
			till: activity.till,
			duration: activity.duration,
			color: activity.color,
		}));

		const sheet = XLSX.utils.json_to_sheet(activitiesJson);

		XLSX.utils.book_append_sheet(context.workbook, sheet, 'Activities');
	}

	private getDateString(date: string): string {
		const result = DateTime.fromISO(date, { setZone: true }).toISODate();

		if (!result) {
			throw new Error(`Invalid activity date: ${date}`);
		}

		return result;
	}
}

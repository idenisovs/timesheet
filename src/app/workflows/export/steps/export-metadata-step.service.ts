import { Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExportContext } from '@workflows/export/export-context';
import { Step } from '@workflows/Step';

@Service()
export class ExportMetadataStepService implements Step<ExportContext> {
	async execute(context: ExportContext): Promise<void> {
		const sheet = XLSX.utils.json_to_sheet([
			{ type: 'activities', version: 1 },
			{ type: 'issues', version: 1 },
			{ type: 'projects', version: 1 },
		]);
		XLSX.utils.book_append_sheet(context.workbook, sheet, 'Metadata');
	}
}

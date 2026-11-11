import { Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { getDateString } from '@utils/date';
import { ExportContext } from '@workflows/export/export-context';
import { Step } from '@workflows/Step';

@Service()
export class WriteExportStepService implements Step<ExportContext> {
	async execute(context: ExportContext): Promise<void> {
		XLSX.writeFile(context.workbook, `timesheet-${getDateString()}.ods`, {
			compression: true,
			bookType: 'ods',
		});
	}
}

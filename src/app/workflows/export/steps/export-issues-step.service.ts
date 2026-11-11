import { inject, Service } from '@angular/core';
import * as XLSX from 'xlsx';
import { IssueRepositoryService } from '@repository/issue-repository.service';
import { ExportContext } from '@workflows/export/export-context';
import { Step } from '@workflows/Step';

@Service()
export class ExportIssuesStepService implements Step<ExportContext> {
	private readonly issuesRepository = inject(IssueRepositoryService);

	async execute(context: ExportContext): Promise<void> {
		const issues = await this.issuesRepository.getAll();
		const issuesJson = issues.map(issue => {
			const { activities, ...exportedIssue } = issue;
			return {
				...exportedIssue,
				createdAt: issue.createdAt?.toISOString(),
			};
		});
		const sheet = XLSX.utils.json_to_sheet(issuesJson);
		XLSX.utils.book_append_sheet(context.workbook, sheet, 'Issues');
	}
}

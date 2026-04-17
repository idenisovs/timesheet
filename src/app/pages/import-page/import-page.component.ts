import { Component, inject } from '@angular/core';

import * as XLSX from 'xlsx';
import { WorkBook } from 'xlsx';

import { Activity, Issue, Project } from '../../entities';
import { ImportProjectsComponent } from './import-projects/import-projects.component';
import { ImportIssuesComponent } from './import-issues/import-issues.component';
import { ImportActivitiesComponent } from './import-activities/import-activities.component';
import { ReaderService } from '../../reader/reader.service';

@Component({
	selector: 'app-import-page',
	imports: [
		ImportProjectsComponent,
		ImportIssuesComponent,
	],
	templateUrl: './import-page.component.html',
	styleUrl: './import-page.component.scss',
})
export class ImportPageComponent {
	private reader = inject(ReaderService);

	projects: Project[] = [];
	issues: Issue[] = [];
	activities: Activity[] = [];
	isImportSectionsVisible = false;

	public async readImportFile(event: Event) {
		const importFile = this.getImportFileFromInput(event);

		if (!importFile) {
			return;
		}

		const workbook: WorkBook = XLSX.read(await importFile.arrayBuffer());

		if (!workbook) {
			return;
		}

		this.isImportSectionsVisible = true;
		this.readProjectImports(workbook);
		this.readIssueImports(workbook);
		this.readActivityImports(workbook);
	}

	private getImportFileFromInput(event: Event): File | null {
		const target = event.target as HTMLInputElement;

		if (!target.files) {
			return null;
		}

		return target.files.item(0);
	}

	readProjectImports(workbook: XLSX.WorkBook) {
		this.projects = this.reader.projects(workbook);
	}

	readIssueImports(workbook: XLSX.WorkBook) {
		this.issues = this.reader.issues(workbook);
	}

	readActivityImports(workbook: XLSX.WorkBook) {
		this.activities = this.reader.activities(workbook);
	}
}

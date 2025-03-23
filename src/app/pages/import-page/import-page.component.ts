import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import { WorkBook } from 'xlsx';

import { Activity, Issue, Project } from '../../dto';
import { ImportProjectsComponent } from './import-projects/import-projects.component';
import { ImportIssuesComponent } from './import-issues/import-issues.component';
import { ImportActivitiesComponent } from './import-activities/import-activities.component';
import { ReaderService } from '../../reader/reader.service';

@Component({
    selector: 'app-import-page',
    imports: [
        ImportProjectsComponent,
        NgIf,
        ImportIssuesComponent,
        ImportActivitiesComponent,
    ],
    templateUrl: './import-page.component.html',
    styleUrl: './import-page.component.scss'
})
export class ImportPageComponent {
  projects: Project[] = [];
  issues: Issue[] = [];
  activities: Activity[] = [];
  isImportSectionsVisible = false;

  constructor(
    private reader: ReaderService
  ) {}

  async readImportFile(event: Event) {
    const workbook = await this.getWorkBook(event);

    if (workbook) {
      this.isImportSectionsVisible = true;
      this.readProjectImports(workbook);
      this.readIssueImports(workbook);
      this.readActivityImports(workbook);
    }
  }

  private async getWorkBook(event: Event): Promise<WorkBook | null> {
    const file = this.getFile(event);

    if (!file) {
      return null;
    }

    return XLSX.read(await file.arrayBuffer());
  }

  private getFile(event: Event): File | null {
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

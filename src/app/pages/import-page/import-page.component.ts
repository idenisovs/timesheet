import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import * as XLSX from 'xlsx';

import { ImportedProject, ImportedIssue } from './Imports';
import { Activity, Issue, Project } from '../../dto';
import { ImportProjectsComponent } from './import-projects/import-projects.component';
import { ImportIssuesComponent } from './import-issues/import-issues.component';
import { ImportActivitiesComponent } from './import-activities/import-activities.component';
import { ReaderService } from '../../reader/reader.service';

@Component({
  selector: 'app-import-page',
  standalone: true,
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
    private importer: ReaderService
  ) {}

  async getFile(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    const file = target.files.item(0);

    if (!file) {
      return;
    }

    this.isImportSectionsVisible = true;

    const workbook = XLSX.read(await file.arrayBuffer());
    this.readProjectImports(workbook);
    this.readIssueImports(workbook);
    this.readActivityImports(workbook);
  }

  readProjectImports(workbook: XLSX.WorkBook) {
    const projectsSheet = workbook.Sheets['Projects'];
    const importedProjects: ImportedProject[] = XLSX.utils.sheet_to_json(projectsSheet);
    this.projects = importedProjects.map(Project.fromImport);
  }

  readIssueImports(workbook: XLSX.WorkBook) {
    const issuesSheet = workbook.Sheets['Issues'];
    const importedIssues: ImportedIssue[] = XLSX.utils.sheet_to_json(issuesSheet);
    this.issues = importedIssues.map(Issue.fromImport);
  }

  readActivityImports(workbook: XLSX.WorkBook) {
    this.activities = this.importer.activities(workbook);

    this.activities.forEach(activity => console.log(activity));

    // const activitySheet = workbook.Sheets['Activities'];
    // const importedActivities: ImportedActivity[] = XLSX.utils.sheet_to_json(activitySheet);
    // this.activities = importedActivities.map(Activity.fromImport);
  }
}

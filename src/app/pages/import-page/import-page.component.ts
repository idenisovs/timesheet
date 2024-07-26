import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

import { ImportedProject, ImportedIssue, ImportedActivity } from './Imports';
import { Project } from '../../dto';
import { ImportProjectsComponent } from './import-projects/import-projects.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [
    ImportProjectsComponent,
    NgIf,
  ],
  templateUrl: './import-page.component.html',
  styleUrl: './import-page.component.scss'
})
export class ImportPageComponent {
  projects: Project[] = [];
  issues: ImportedIssue[] = [];
  activities: ImportedActivity[] = [];

  async getFile(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    const file = target.files.item(0);

    if (!file) {
      return;
    }

    const workbook = XLSX.read(await file.arrayBuffer());

    const projectsSheet = workbook.Sheets['Projects'];

    const importedProjects: ImportedProject[] = XLSX.utils.sheet_to_json(projectsSheet);

    this.projects = importedProjects.map(Project.fromImport);

    const issuesSheet = workbook.Sheets['Issues'];

    this.issues = XLSX.utils.sheet_to_json(issuesSheet);

    const activitiesSheet = workbook.Sheets['Activities'];

    this.activities = XLSX.utils.sheet_to_json(activitiesSheet);
  }
}

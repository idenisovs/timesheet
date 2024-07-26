import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

import { ImportedProject, ImportedIssue, ImportedActivity } from './Imports';
import { Project } from '../../dto';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [],
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

    const importedProject: ImportedProject[] = XLSX.utils.sheet_to_json(projectsSheet);

    this.projects = importedProject.map(Project.fromImport);

    const issuesSheet = workbook.Sheets['Issues'];

    this.issues = XLSX.utils.sheet_to_json(issuesSheet);

    const activitiesSheet = workbook.Sheets['Activities'];

    this.activities = XLSX.utils.sheet_to_json(activitiesSheet);
  }
}

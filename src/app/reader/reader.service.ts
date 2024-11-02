import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Activity, Issue, Project } from '../dto';
import { Metadata, MetadataField, MetadataFieldType, MetadataRecord } from './Metadata';
import { ActivityReaderFactory } from './activities/ActivityReaderFactory';
import { ActivityRecord } from './activities/ActivityRecord';
import { ImportedIssue, ImportedProject } from '../pages/import-page/Imports';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  constructor() { }

  public activities(workbook: XLSX.WorkBook): Activity[] {
    const metadata = this.readMetadata(workbook);
    const importer = new ActivityReaderFactory(metadata)
    const sheet = workbook.Sheets['Activities'];
    const records = XLSX.utils.sheet_to_json<ActivityRecord>(sheet);
    return importer.read(records);
  }

  public issues(workbook: XLSX.WorkBook): Issue[] {
    const issuesSheet = workbook.Sheets['Issues'];
    const importedIssues: ImportedIssue[] = XLSX.utils.sheet_to_json(issuesSheet);
    return importedIssues.map(Issue.fromImport);
  }

  public projects(workbook: XLSX.WorkBook): Project[] {
    const projectsSheet = workbook.Sheets['Projects'];
    const importedProjects: ImportedProject[] = XLSX.utils.sheet_to_json(projectsSheet);
    return importedProjects.map(Project.fromImport);
  }

  private readMetadata(workbook: XLSX.WorkBook): Metadata {
    const metadataSheet = workbook.Sheets['Metadata'];

    if (!metadataSheet) {
      return new Metadata();
    }

    const metadataJson: MetadataRecord[] = XLSX.utils.sheet_to_json(metadataSheet);

    return {
      activities: this.readMetadataField(metadataJson, MetadataFieldType.activities)
    };
  }

  private readMetadataField(json: MetadataRecord[], type: MetadataFieldType): MetadataField {
    const metadataFieldData = json.find(record => record.type === type);

    if (!metadataFieldData) {
      return new MetadataField();
    }

    return {
      version: metadataFieldData.version
    };
  }
}

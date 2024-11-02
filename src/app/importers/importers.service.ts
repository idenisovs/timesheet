import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Activity } from '../dto';
import { Metadata, MetadataField, MetadataFieldType, MetadataRecord } from './Metadata';
import { ActivityReaderFactory } from './activities/ActivityReaderFactory';
import { ActivityRecord } from './activities/ActivityRecord';

@Injectable({
  providedIn: 'root'
})
export class ImportersService {
  constructor() { }

  public activities(workbook: XLSX.WorkBook): Activity[] {
    const metadata = this.readMetadata(workbook);
    const importer = new ActivityReaderFactory(metadata)
    const sheet = workbook.Sheets['Activities'];
    const records = XLSX.utils.sheet_to_json<ActivityRecord>(sheet);
    return importer.read(records);
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
    const metadataFieldData = json.find(record => record.type === MetadataFieldType.activities);

    if (!metadataFieldData) {
      return new MetadataField();
    }

    return {
      version: metadataFieldData.version
    };
  }
}

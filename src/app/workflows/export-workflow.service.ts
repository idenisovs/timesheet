import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { getDateString } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ExportWorkflowService {

  constructor() { }

  public export() {
    const sheet = XLSX.utils.sheet_new();
    const workbook = XLSX.utils.book_new(sheet, 'activities');

    const date = getDateString();

    XLSX.writeFile(workbook, `timesheet-${date}.ods`, { compression: true });
  }
}

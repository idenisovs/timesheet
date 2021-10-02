import { Injectable } from '@angular/core';
import CsvRecord from '../dto/CsvRecord';
import CsvProcessingResult from './CsvProcessingResult';

@Injectable({
  providedIn: 'root'
})
export class SheetCsvService {
  public static readonly DELIMITER = ';';

  public static readonly CSV_COLS = [
    'date', 'name', 'from', 'till', 'duration', 'id'
  ];

  constructor() { }

  validateFile(file: File) {
    if (file.name.split('.').pop() !== 'csv') {
      throw new Error('Unexpected extension! File should be CSV!');
    }

    if (!(file.type === 'plain/text' || file.type !== 'plain/csv')) {
      throw new Error('Unexpected type! File should be plain/text or plain/csv!');
    }
  }

  validateHeader(header: string) {
    const cols = header.split(SheetCsvService.DELIMITER);

    for (let requiredColumn of SheetCsvService.CSV_COLS) {
      if (cols.indexOf(requiredColumn) === -1) {
        throw new Error(`CSV header missed an column: ${requiredColumn}!`);
      }
    }
  }

  process(records: string[]): CsvProcessingResult {
    const result: CsvRecord[] = [];

    const headerCols = records[0].split(SheetCsvService.DELIMITER);

    let from: string|null = null;
    let till: string|null = null;

    for (let line = 1; line < records.length; line++) {
      const cols = records[line].split(SheetCsvService.DELIMITER);

      const recordObj = cols.reduce((result: any, value: string, idx: number) => {
        const fieldName = headerCols[idx];

        result[fieldName] = value;

        return result;
      }, {}) as CsvRecord;

      if (!from || from > recordObj.date) {
        from = recordObj.date;
      }

      if (!till || till < recordObj.date) {
        till = recordObj.date;
      }

      result.push(recordObj);
    }

    return {
      recordsCount: result.length - 1,
      result,
      from: from!,
      till: till!
    }
  }
}

import { Injectable } from '@angular/core';
import { CsvRecord } from '../dto';
import CsvProcessingResult from './CsvProcessingResult';
import { saveAs } from 'file-saver';
import { SheetStoreService } from './sheet-store.service';

@Injectable({
  providedIn: 'root'
})
export class SheetCsvService {
  public static readonly DELIMITER = ';';

  public static readonly CSV_COLS = [
    'date', 'name', 'from', 'till', 'duration', 'id'
  ];

  constructor(
    private store: SheetStoreService
  ) { }

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

  process(csv: string): CsvProcessingResult {
    const records = csv.split('\n');

    const header = records[0];

    this.validateHeader(header)

    const result: CsvRecord[] = [];

    const headerCols = records[0].split(SheetCsvService.DELIMITER);

    let from: string|null = null;
    let till: string|null = null;

    for (let line = 1; line < records.length; line++) {
      if (!records[line].trim().length) {
        continue;
      }

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
      recordsCount: result.length,
      result,
      from: from!,
      till: till!
    }
  }

  async export() {
    const sheet = await this.store.load();

    const header = SheetCsvService.CSV_COLS.join(SheetCsvService.DELIMITER);

    const file = [ header ];

    for (const dailySheet of sheet) {
      for (let activity of dailySheet.activities) {
        const row = [dailySheet.date, activity.name, activity.from, activity.till, activity.duration, dailySheet.id];

        file.push(row.join(SheetCsvService.DELIMITER));
      }
    }

    const blob = new Blob([file.join('\n')]);

    const today = new Date();

    const date = today.toISOString().split('T')[0];

    saveAs(blob, `timesheet-${date}.csv`);
  }
}

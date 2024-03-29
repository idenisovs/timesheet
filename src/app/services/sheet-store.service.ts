import { Injectable } from '@angular/core';
import SheetStore from '../store/SheetStore';
import { getDateString } from '../utils';
import { CsvRecord, Sheet, Issue } from '../dto';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheetStoreService {
  private db = new SheetStore();
  private importEvent = new Subject<CsvRecord[]>();

  public get ImportEvent(): Observable<CsvRecord[]> {
    return this.importEvent.asObservable();
  }

  public get Instance(): SheetStore {
    return this.db;
  }

  constructor() {
    this.db.open().then(() => {});
  }

  loadTimeSheets(): Promise<Sheet[]> {
    return this.db.sheet.orderBy('date').reverse().toArray();
  }

  loadIssues(): Promise<Issue[]> {
    return this.db.issues.orderBy('createdAt').reverse().toArray();
  }

  async save(sheet: Sheet) {
    if (!sheet.id) {
      delete sheet.id;
    }

    await this.db.sheet.put(sheet);
  }

  async prepareForToday() {
    const today = getDateString();

    const records = await this.db.sheet.where({
      date: today
    }).toArray();

    if (records.length) {
      return;
    }

    await this.createRecord();
  }

  fireImportEvent(timesheet: CsvRecord[]) {
    this.importEvent.next(timesheet);
  }

  private createRecord(): Promise<number> {
    return this.db.sheet.put({
      date: getDateString(),
      activities: []
    });
  }
}

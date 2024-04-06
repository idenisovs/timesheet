import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import SheetStore from '../store/SheetStore';
import { CsvRecord, Sheet, Issue, Week } from '../dto';

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

  async prepareForToday(): Promise<void> {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const currentWeek = await this.db.weeks.where('till').aboveOrEqual(today).first();

    if (currentWeek) {
      return;
    }

    const week = new Week(today);

    await this.db.weeks.add(Week.entity(week));
  }

  fireImportEvent(timesheet: CsvRecord[]) {
    this.importEvent.next(timesheet);
  }
}

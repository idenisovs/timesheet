import { Injectable } from '@angular/core';

import SheetStore from '../store/SheetStore';
import { Sheet, Issue } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class SheetStoreService {
  private db = new SheetStore();

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
}

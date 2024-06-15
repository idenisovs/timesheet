import { Injectable } from '@angular/core';

import SheetStore from '../store/SheetStore';
import { Sheet, Issue, Week, Day } from '../dto';

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

  async prepareForToday(): Promise<void> {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let currentWeek = await this.db.weeks.where('till').aboveOrEqual(today).first();

    if (!currentWeek) {
      const week = new Week(today);
      currentWeek = Week.entity(week);
      await this.db.weeks.add(currentWeek);
    }

    const currentDay = await this.db.days.where('date').equals(today.toISOString()).first();

    if (!currentDay) {
      const day = new Day();
      day.weekId = currentWeek.id;
      await this.db.days.add(Day.entity(day));
    }
  }
}

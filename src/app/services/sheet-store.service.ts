import { Injectable } from '@angular/core';
import SheetStore from '../store/SheetStore';
import { getDateString } from '../utils';
import Sheet from '../dto/Sheet';

@Injectable({
  providedIn: 'root'
})
export class SheetStoreService {
  private db = new SheetStore();

  constructor() {
    this.db.open().then(() => {});
  }

  load(): Promise<Sheet[]> {
    return this.db.sheet.orderBy('date').reverse().toArray();
  }

  async save(sheet: Sheet) {
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

  private createRecord(): Promise<number> {
    return this.db.sheet.put({
      date: getDateString(),
      activities: []
    });
  }
}

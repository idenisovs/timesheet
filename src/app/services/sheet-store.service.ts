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
    console.log('Opening TimeSheet database...');

    this.db.open().then(() => {
      console.log('TimeSheet database opened!');
    }).catch(() => {
      console.error('Error opening TimeSheet database!');
    });
  }

  async load(): Promise<Sheet[]> {
    return this.db.sheet.toArray();
  }

  async save(sheet: Sheet) {
    await this.db.sheet.put(sheet);
  }

  async prepareForToday() {
    console.log('Preparing for today...');

    const today = getDateString();

    const records = await this.db.sheet.where({
      date: today
    }).toArray();

    if (records.length) {
      console.log('Nothing to do!');
      return;
    }

    await this.createRecord();

    console.log('Done!');
  }

  private createRecord(): Promise<number> {
    console.log('Creating record for today...');

    return this.db.sheet.put({
      date: getDateString(),
      activities: []
    });
  }
}

import { Injectable } from '@angular/core';

import { Week } from '../dto';
import { SheetStoreService } from '../services/sheet-store.service';
import { WeekRecord } from '../store/records';
import { getMonday } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class WeeksRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getById(weekId: string): Promise<Week|null> {
    const record: WeekRecord|undefined = await this.db.weeks.where('id').equals(weekId).first();
    return record ? Week.build(record) : null;
  }

  async getByDate(date: Date): Promise<Week|null> {
    const monday = getMonday(date);
    const record = await this.db.weeks.where({ from: monday.toISOString() }).first();
    return record ? Week.build(record) : null;
  }

  async getAll(): Promise<Week[]> {
    const records: WeekRecord[] = await this.db.weeks.orderBy('till').reverse().toArray();
    return records.map(Week.build)
  }

  save(week: Week) {
    return this.db.weeks.put(Week.entity(week));
  }
}

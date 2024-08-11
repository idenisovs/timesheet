import { Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { DayRecord } from '../store/records';
import { Week, Day } from '../dto';
import { startOfDay } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DaysRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getAll(): Promise<Day[]> {
    const dayEntities = await this.db.days.orderBy('date').reverse().toArray();
    return this.map(dayEntities);
  }

  async getById(id: string): Promise<Day|null> {
    const record = await this.db.days.where('id').equals(id).first();
    return record ? Day.build(record) : null;
  }

  async getByDate(date: Date): Promise<Day|null> {
    const dayDate = startOfDay(date);
    const record = await this.db.days.where('date').equals(dayDate).first();
    return record ? Day.build(record) : null;
  }

  async getByWeek(week: Week) {
    const entities = await this.db.days.where('weekId').equals(week.id).reverse().sortBy('date');

    return this.map(entities);
  }

  async create(day: Day): Promise<Day> {
    const entity = Day.entity(day);
    await this.db.days.add(entity);
    return day;
  }

  async remove(day: Day): Promise<void> {
    return this.db.days.delete(day.id);
  }

  private map(entities: DayRecord[]): Day[] {
    return entities.map((entity) => Day.build(entity));
  }
}

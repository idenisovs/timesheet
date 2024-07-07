import { Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { DayEntity } from '../store/entities';
import { Week, Day } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class DaysRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getById(id: string): Promise<Day|null> {
    const record = await this.db.days.where('id').equals(id).first();

    if (!record) {
      return null;
    }

    return Day.build(record);
  }

  async getByWeek(week: Week) {
    const entities = await this.db.days.where('weekId').equals(week.id).toArray();

    return this.map(entities);
  }

  async create(day: Day): Promise<Day> {
    await this.db.days.add(day);
    return day;
  }

  private map(entities: DayEntity[]): Day[] {
    return entities.map((entity) => Day.build(entity));
  }
}

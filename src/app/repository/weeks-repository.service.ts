import { Injectable } from '@angular/core';

import { Week, Day } from '../dto';
import { SheetStoreService } from '../services/sheet-store.service';
import { WeekEntity } from '../store/entities';

@Injectable({
  providedIn: 'root'
})
export class WeeksRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getAll(): Promise<Week[]> {
    const raw = await this.db.weeks.orderBy('till').reverse().toArray();

    const weeks = this.map(raw);

    for (let week of weeks) {
      const dayEntities = await this.db.days.where('weekId').equals(week.id).reverse().sortBy('date');

      week.days = dayEntities.map((entity) => Day.build(entity));

      for (let day of week.days) {
        day.activities = await this.db.activities.where('dayId').equals(day.id).sortBy('from');
      }
    }

    return weeks;
  }

  save(week: Week) {
    return this.db.weeks.put(Week.entity(week));
  }

  private map(weeks: WeekEntity[]): Week[] {
    return weeks.map((week: WeekEntity) => Week.build(week));
  }
}

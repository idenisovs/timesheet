import { Injectable } from '@angular/core';
import SheetStore from '../store/SheetStore';
import { SheetStoreService } from '../services/sheet-store.service';
import { Week } from '../dto';
import { DayEntity } from '../store/entities';
import { Day } from '../dto/Day';

@Injectable({
  providedIn: 'root'
})
export class DaysRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getByWeek(week: Week) {
    const entities = await this.db.days.where('weekId').equals(week.id).toArray();

    return this.map(entities);
  }

  private map(entities: DayEntity[]): Day[] {
    return entities.map((entity) => Day.build(entity));
  }
}

import { Injectable } from '@angular/core';
import { Week } from '../dto';
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

    return this.map(raw);
  }

  save(week: Week) {
    return this.db.weeks.put(Week.entity(week));
  }

  private map(weeks: WeekEntity[]): Week[] {
    return weeks.map((week: WeekEntity) => Week.build(week));
  }
}

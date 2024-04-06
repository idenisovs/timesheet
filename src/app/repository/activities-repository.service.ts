import { Injectable } from '@angular/core';
import { SheetStoreService } from '../services/sheet-store.service';
import { Activity, Week } from '../dto';
import { Day } from '../dto/Day';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  getByWeek(week: Week): Promise<Activity[]> {
    return this.db.activities.where('weekId').equals(week.id).toArray();
  }

  getByDay(day: Day): Promise<Activity[]> {
    return this.db.activities.where('dayId').equals(day.id).toArray();
  }
}

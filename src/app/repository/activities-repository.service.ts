import { Injectable } from '@angular/core';
import { SheetStoreService } from '../services/sheet-store.service';
import { Activity, Week, Day } from '../dto';

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

  async getByIds(ids: string[]): Promise<Activity[]> {
    const entities = await this.db.activities.where('id').anyOf(ids).reverse().sortBy('date');

    return entities.map(entity => new Activity(entity));
  }

  async getByIssueKey(issueKey: string): Promise<Activity[]> {
    const entities = await this.db.activities.where('name').startsWith(`${issueKey}:`).reverse().sortBy('date');

    return entities.map(entity => new Activity(entity));
  }

  async save(activities: Activity[]): Promise<void> {
    await this.db.activities.bulkPut(activities);
  }

  async remove(activityIds: string[]): Promise<void> {
    await this.db.activities.bulkDelete(activityIds);
  }
}

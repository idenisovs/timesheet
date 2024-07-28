import { Injectable } from '@angular/core';
import { SheetStoreService } from '../services/sheet-store.service';
import { Activity, Week, Day } from '../dto';
import { ActivityEntity } from '../store/entities';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesRepositoryService {
  private db = this.store.Instance;

  constructor(private store: SheetStoreService) { }

  async getAll(raw = false): Promise<Activity[] | ActivityEntity[]> {
    const records: ActivityEntity[] = await this.db.activities.toArray();

    if (raw) {
      return records;
    } else {
      return records.map(Activity.fromRecord);
    }
  }

  async getByWeek(week: Week): Promise<Activity[]> {
    const records = await this.db.activities.where('weekId').equals(week.id).toArray();
    return records.map(Activity.fromRecord);
  }

  async getByDay(day: Day): Promise<Activity[]> {
    const records = await this.db.activities.where('dayId').equals(day.id).toArray();
    return records.map(Activity.fromRecord);
  }

  async getByIds(ids: string[]): Promise<Activity[]> {
    const records = await this.db.activities.where('id').anyOf(ids).reverse().sortBy('date');
    return records.map(Activity.fromRecord);
  }

  async getByIssueKey(issueKey: string): Promise<Activity[]> {
    const records = await this.db.activities.where('name').startsWith(issueKey).reverse().sortBy('date');
    return records.map(Activity.fromRecord);
  }

  async save(activities: Activity[]): Promise<void> {
    await this.db.activities.bulkPut(activities);
  }

  async remove(activityIds: string[]): Promise<void> {
    await this.db.activities.bulkDelete(activityIds);
  }
}

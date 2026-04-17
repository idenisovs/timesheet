import { inject, Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { Activity, Week, Day } from '../entities';
import { ActivityRecord } from '../store/records';

@Injectable({
	providedIn: 'root',
})
export class ActivitiesRepositoryService {
	private store = inject(SheetStoreService);

	private db = this.store.Instance;

	async getAll(raw = false): Promise<Activity[] | ActivityRecord[]> {
		const records: ActivityRecord[] = await this.db.activities.toArray();

		if (raw) {
			return records;
		} else {
			return records.map(Activity.fromRecord);
		}
	}

	async getByWeek(week: Week): Promise<Activity[]> {
		const records = await this.db.activities
			.where('date')
			.between(week.start, week.end, true, true)
			.toArray();
		return records.map(Activity.fromRecord);
	}

	async getByDay(day: Day, reverse = false): Promise<Activity[]> {
		let query = this.db.activities.where('date').equals(day.date);

		if (reverse) {
			query = query.reverse();
		}

		const records: ActivityRecord[] = await query.sortBy('from');
		return records.map(Activity.fromRecord);
	}

	async getByDays(days: Day[], reverse = false): Promise<Activity[]> {
		const dates = days.map(day => day.date);
		let query = this.db.activities.where('date').anyOf(dates);

		if (reverse) {
			query = query.reverse();
		}

		const records = await query.sortBy('date');
		return records.map(Activity.fromRecord);
	}

	async getById(id: string): Promise<Activity | null> {
		const record = await this.db.activities.where('id').equals(id).first();
		return record ? Activity.fromRecord(record) : null;
	}

	async getByIds(ids: string[]): Promise<Activity[]> {
		const records = await this.db.activities.where('id').anyOf(ids).reverse().sortBy('date');
		return records.map(Activity.fromRecord);
	}

	async getByIssueKey(issueKey: string): Promise<Activity[]> {
		const records = await this.db.activities.where('name').startsWith(issueKey).reverse().sortBy('date');
		return records.map(Activity.fromRecord);
	}

	async getByIssueId(issueId: string): Promise<Activity[]> {
		const records = await this.db.activities.where('issueId').equals(issueId).toArray();
		return records.map(Activity.fromRecord);
	}

	async getFirstActivity(): Promise<Activity | null> {
		const record = await this.db.activities.orderBy('date').first();
		return record ? Activity.fromRecord(record) : null;
	}

	async save(activities: Activity[]): Promise<void> {
		await this.db.activities.bulkPut(activities);
	}

	async remove(activityIds: string[]): Promise<void> {
		await this.db.activities.bulkDelete(activityIds);
	}

	async create(): Promise<Activity> {
		const activity = new Activity();
		await this.db.activities.add(activity);
		return activity;
	}
}

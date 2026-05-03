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
		return this.getByDate(day.date, reverse);
	}

	async getByDate(date: string, reverse = false): Promise<Activity[]> {
		let query = this.db.activities.where('date').equals(date);

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

	async getFirstByIssueId(issueId: string): Promise<Activity | null> {
		const record = await this.db.activities.where('issueId').equals(issueId).first();
		return record ? Activity.fromRecord(record) : null;
	}

	async getFirstActivity(): Promise<Activity | null> {
		const record = await this.db.activities.orderBy('date').first();
		return record ? Activity.fromRecord(record) : null;
	}

	async getByName(name: string): Promise<Activity[]> {
		const records = await this.db.activities.where('name').equals(name).toArray();
		return records.map(Activity.fromRecord);
	}

	async getFirstByName(name: string): Promise<Activity | null> {
		const record = await this.db.activities.where('name').equals(name).first();
		return record ? Activity.fromRecord(record) : null;
	}

	async getByPrefix(prefix: string): Promise<Activity[]> {
		const records = await this.db.activities.where('name').startsWith(prefix).toArray();
		return records.map(Activity.fromRecord);
	}

	async getFirstByNamePrefix(prefix: string): Promise<Activity | null> {
		const record = await this.db.activities.where('name').startsWith(prefix + ':').first();
		return record ? Activity.fromRecord(record) : null;
	}

	async save(activities: Activity[]): Promise<void> {
		await this.db.activities.bulkPut(activities);
	}

	async remove(activities: Activity[]): Promise<void> {
		const activityIds = activities.map(activity => activity.id);
		await this.db.activities.bulkDelete(activityIds);
	}

	async create(): Promise<Activity> {
		const activity = new Activity();
		await this.db.activities.add(activity);
		return activity;
	}

	async findFirstByPrefix(id: string, prefix: string): Promise<Activity | null> {
		const record = await this.db.activities
			.where('name')
			.startsWith(prefix + ':')
			.filter(activity => activity.id !== id)
			.first();

		return record ? Activity.fromRecord(record) : null;
	}

	async findFirstByName(id: string, name: string): Promise<Activity | null> {
		const record = await this.db.activities
			.where('name')
			.equals(name)
			.filter(activity => activity.id !== id)
			.first();

		return record ? Activity.fromRecord(record) : null;
	}

	async isActivityPrefixUnique(id: string, prefix: string): Promise<boolean> {
		const count = await this.db.activities
			.where('name')
			.startsWith(prefix + ':')
			.filter(activity => activity.id !== id)
			.count();

		return count === 0;
	}

	async isActivityNameUnique(id: string, name: string): Promise<boolean> {
		const count = await this.db.activities
			.where('name')
			.equals(name)
			.filter(activity => activity.id !== id)
			.count();

		return count === 0;
	}
}

import { inject, Injectable } from '@angular/core';

import { Week } from '../entities';
import { SheetStoreService } from '../services/sheet-store.service';
import { WeekRecord } from '../store/records';
import { getMonday } from '../utils/date-v2';

@Injectable({
	providedIn: 'root'
})
export class WeeksRepositoryService {
	private store = inject(SheetStoreService);

	private db = this.store.Instance;

	async getById(weekId: string): Promise<Week | null> {
		const record: WeekRecord | undefined = await this.db.weeks.where('id').equals(weekId).first();
		return record ? Week.fromRecord(record) : null;
	}

	async getByDate(date: Date | string): Promise<Week | null> {
		const monday = getMonday(date);
		const record = await this.db.weeks.where({ from: monday }).first();
		return record ? Week.fromRecord(record) : null;
	}

	getCount(): Promise<number> {
		return this.db.weeks.count();
	}

	async getAll(): Promise<Week[]> {
		const records: WeekRecord[] = await this.db.weeks.orderBy('till').reverse().toArray();
		return records.map(Week.fromRecord);
	}

	async getByOffset(offset = 0): Promise<Week | null> {
		const record: WeekRecord | undefined = await this.db.weeks
			.orderBy('till')
			.reverse()
			.offset(offset)
			.limit(1)
			.first();

		if (record) {
			return Week.fromRecord(record);
		}

		return null;
	}

	save(week: Week) {
		return this.db.weeks.put(Week.toRecord(week));
	}
}

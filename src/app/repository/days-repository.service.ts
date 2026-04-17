import { inject, Injectable } from '@angular/core';

import { SheetStoreService } from '../services/sheet-store.service';
import { DayRecord } from '../store/records';
import { Week, Day } from '../entities';
import { getDateIso } from '../utils/date-v2';

@Injectable({
	providedIn: 'root',
})
export class DaysRepositoryService {
	private store = inject(SheetStoreService);

	private db = this.store.Instance;

	async getAll(): Promise<Day[]> {
		const dayEntities = await this.db.days.orderBy('date').reverse().toArray();
		return this.map(dayEntities);
	}

	async getById(id: string): Promise<Day | null> {
		const record = await this.db.days.where('id').equals(id).first();
		return record ? Day.fromRecord(record) : null;
	}

	async getByDate(date: Date | string): Promise<Day | null> {
		const dayDate = typeof date === 'string' ? date : getDateIso(date);
		const record = await this.db.days.where('date').equals(dayDate).first();
		return record ? Day.fromRecord(record) : null;
	}

	async getByWeek(week: Week) {
		const entities = await this.db.days
			.where('date')
			.between(week.start, week.end, true, true)
			.reverse()
			.sortBy('date');

		return this.map(entities);
	}

	async getByRange(from: Date, till: Date): Promise<Day[]> {
		return this.db.days.where('date').between(from, till, true, true).sortBy('date');
	}

	async create(day: Day): Promise<Day> {
		const entity = Day.toRecord(day);
		await this.db.days.add(entity);
		return day;
	}

	async remove(day: Day): Promise<void> {
		return this.db.days.delete(day.id);
	}

	private map(entities: DayRecord[]): Day[] {
		return entities.map((entity) => Day.fromRecord(entity));
	}
}

import { inject, Injectable } from '@angular/core';

import { WeeksRepositoryService } from '../repository/weeks-repository.service';
import { DaysRepositoryService } from '../repository/days-repository.service';
import { Day, Week } from '../entities';
import { getCurrentDateIso } from '../utils/date-v2';

@Injectable({
	providedIn: 'root',
})
export class PrepareForTodayWorkflowService {
	private weeksRepo = inject(WeeksRepositoryService);
	private daysRepo = inject(DaysRepositoryService);

	async run() {
		const today = getCurrentDateIso();

		let currentWeek = await this.weeksRepo.getByDate(today);

		if (!currentWeek) {
			currentWeek = new Week(today);
			await this.weeksRepo.save(currentWeek);
		}

		let currentDay = await this.daysRepo.getByDate(today);

		if (!currentDay) {
			currentDay = new Day();
			currentDay.weekId = currentWeek.id;
			await this.daysRepo.create(currentDay);
		}
	}
}

import { Injectable } from '@angular/core';

import { WeeksRepositoryService } from '../repository/weeks-repository.service';
import { DaysRepositoryService } from '../repository/days-repository.service';
import { Day, Week } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class PrepareForTodayWorkflowService {

  constructor(
    private weekRepo: WeeksRepositoryService,
    private dayRepo: DaysRepositoryService
  ) { }

  async run() {
    const today = new Date();

    let currentWeek = await this.weekRepo.getByDate(today);

    if (!currentWeek) {
      currentWeek = new Week(today);
      await this.weekRepo.save(currentWeek);
    }

    let currentDay = await this.dayRepo.getByDate(today);

    if (!currentDay) {
      currentDay = new Day();
      currentDay.weekId = currentWeek.id;
      await this.dayRepo.create(currentDay);
    }
  }
}

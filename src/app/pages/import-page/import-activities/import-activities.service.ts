import { Injectable } from '@angular/core';

import { WeeksRepositoryService } from '../../../repository/weeks-repository.service';
import { DaysRepositoryService } from '../../../repository/days-repository.service';
import { SaveActivitiesWorkflowService } from '../../../workflows/save-activities-workflow.service';
import { Activity, Day, Week } from '../../../dto';

@Injectable({
  providedIn: 'root'
})
export class ImportActivitiesService {
  constructor(
    private weekRepository: WeeksRepositoryService,
    private dayRepository: DaysRepositoryService,
    private activitySaveWorkflow: SaveActivitiesWorkflowService
  ) { }

  async save(importedActivity: Activity): Promise<void> {
    await this.createWeekIfNotExists(importedActivity);
    const day = await this.createDayIfNotExists(importedActivity);
    await this.activitySaveWorkflow.save(day, [importedActivity], [])
  }

  async createWeekIfNotExists(importedActivity: Activity): Promise<void> {
    const existingWeek = await this.weekRepository.getById(importedActivity.weekId);

    if (existingWeek) {
      return;
    }

    const week = new Week(importedActivity.date);
    week.id = importedActivity.weekId;
    await this.weekRepository.save(week);
  }

  async createDayIfNotExists(importedActivity: Activity): Promise<Day> {
    const existingDay = await this.dayRepository.getById(importedActivity.dayId);

    if (existingDay) {
      return existingDay;
    }

    const day = new Day();

    day.id = importedActivity.dayId;
    day.weekId = importedActivity.weekId;
    day.date = new Date(importedActivity.date);

    await this.dayRepository.create(day);

    return day;
  }
}

import { Injectable } from '@angular/core';

import { WeeksRepositoryService } from '../../../repository/weeks-repository.service';
import { DaysRepositoryService } from '../../../repository/days-repository.service';
import { SaveActivitiesWorkflowService } from '../../../workflows/save-activities-workflow.service';
import { Activity, Day, Week } from '../../../dto';
import { RemoveActivitiesWorkflowService } from '../../../workflows/remove-activities-workflow.service';

@Injectable({
  providedIn: 'root'
})
export class ImportActivitiesService {
  constructor(
    private weekRepository: WeeksRepositoryService,
    private dayRepository: DaysRepositoryService,
    private activitySaveWorkflow: SaveActivitiesWorkflowService,
    private activityRemoveWorkflow: RemoveActivitiesWorkflowService
  ) { }

  async save(activity: Activity): Promise<void> {
    const week = await this.createWeekIfNotExists(activity);

    activity.weekId = week.id;

    const day = await this.createDayIfNotExists(activity);

    activity.dayId = day.id;

    await this.activitySaveWorkflow.save(day, [activity])
  }

  async createWeekIfNotExists(importedActivity: Activity): Promise<Week> {
    let existingWeek = await this.weekRepository.getById(importedActivity.weekId);

    if (existingWeek) {
      return existingWeek;
    }

    existingWeek = await this.weekRepository.getByDate(importedActivity.date);

    if (existingWeek) {
      return existingWeek;
    }

    const week = new Week(importedActivity.date);
    week.id = importedActivity.weekId;
    await this.weekRepository.save(week);
    return week;
  }

  async createDayIfNotExists(importedActivity: Activity): Promise<Day> {
    let existingDay = await this.dayRepository.getById(importedActivity.dayId);

    if (existingDay) {
      return existingDay;
    }

    existingDay = await this.dayRepository.getByDate(importedActivity.date);

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

  async remove(activities: Activity[]) {
    const activityIds = activities.map(activity => activity.id);
    await this.activityRemoveWorkflow.run(activityIds);
  }
}

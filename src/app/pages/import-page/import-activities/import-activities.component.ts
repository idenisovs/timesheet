import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

import { Activity } from '../../../dto';
import { ImportedActivityDiffComponent } from './imported-activity-diff/imported-activity-diff.component';
import { ImportActivitiesService } from './import-activities.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';

@Component({
    selector: 'app-import-activities',
    imports: [
        NgForOf,
        ImportedActivityDiffComponent,
    ],
    templateUrl: './import-activities.component.html',
    styleUrl: './import-activities.component.scss'
})
export class ImportActivitiesComponent {
  @Input()
  importedActivities!: Activity[];

  constructor(
    private importService: ImportActivitiesService,
    private activityRepository: ActivitiesRepositoryService
  ) {}

  removeCompletedActivity(activity: Activity) {
    const idx = this.importedActivities.indexOf(activity);
    this.importedActivities.splice(idx, 1);
  }

  async saveAll() {
    let savedActivitiesCount = 0;

    for (let idx = 0; idx < this.importedActivities.length; idx++) {
      const activity = this.importedActivities[idx];
      await this.importService.save(activity);
      this.removeCompletedActivity(activity);
      idx--;
      savedActivitiesCount++;
    }

    alert(`Saved ${savedActivitiesCount} activities!`);
  }

  async saveNewActivities() {
    let savedActivitiesCount = 0;

    for (let idx = 0; idx < this.importedActivities.length; idx++) {
      const activity = this.importedActivities[idx];
      const existingActivity = await this.activityRepository.getById(activity.id);

      if (existingActivity) {
        continue;
      }

      await this.importService.save(activity);
      this.removeCompletedActivity(activity);
      idx--;
      savedActivitiesCount++;
    }

    alert(`Saved ${savedActivitiesCount} activities!`);
  }

  cancelImportingActivities() {
    this.importedActivities.splice(0);
  }
}

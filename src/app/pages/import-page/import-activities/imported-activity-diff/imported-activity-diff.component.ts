import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { Activity } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { ActivitiesRepositoryService } from '../../../../repository/activities-repository.service';
import { ImportActivitiesService } from '../import-activities.service';
import { DaysRepositoryService } from '../../../../repository/days-repository.service';
import { ActivitiesService } from '../../../../services/activities.service';

@Component({
    selector: 'app-imported-activity-diff',
    imports: [
    DatePipe,
    NgClass
],
    templateUrl: './imported-activity-diff.component.html',
    styleUrl: './imported-activity-diff.component.scss'
})
export class ImportedActivityDiffComponent implements OnInit {
  status: DiffStatus = DiffStatus.same;
  existingActivities: Activity[] = [];

  @Input()
  importedActivity!: Activity;

  @Output()
  completed = new EventEmitter<Activity>();

  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private dayRepository: DaysRepositoryService,
    private importService: ImportActivitiesService,
    private activitiesService: ActivitiesService,
  ) {}

  async ngOnInit() {
    if (!this.importedActivity) {
      return;
    }

    this.existingActivities = await this.getExistingActivities(this.importedActivity);
    this.status = this.getDiffStatus();

    if (this.status === DiffStatus.same) {
      this.completed.emit(this.importedActivity);
    }
  }

  async getExistingActivities(importedActivity: Activity): Promise<Activity[]> {
    const existingActivity = await this.activityRepository.getById(importedActivity.id);

    if (existingActivity) {
      return [existingActivity];
    }

    return this.getOverlappingActivities(importedActivity);
  }

  async getOverlappingActivities(importedActivity: Activity): Promise<Activity[]> {
    const day = await this.dayRepository.getByDate(importedActivity.date);

    if (!day) {
      return [];
    }

    const activities = await this.activityRepository.getByDay(day);

    return this.activitiesService.findOverlappingActivities(activities, importedActivity);
  }

  getDiffStatus(): DiffStatus {
    if (!this.existingActivities.length) {
      return DiffStatus.new;
    }

    if (this.existingActivities.length > 1) {
      return DiffStatus.updated;
    }

    const [existingActivity] = this.existingActivities;

    if (this.isSameActivities(existingActivity, this.importedActivity)) {
      return DiffStatus.same;
    } else {
      return DiffStatus.updated;
    }
  }

  isSameActivities(existing: Activity, imported: Activity): boolean {
    return existing.name === imported.name
      && existing.from === imported.from
      && existing.till === imported.till;
  }

  getBtnStyle() {
    switch (this.status) {
      case DiffStatus.new:
        return 'btn-primary';
      case DiffStatus.updated:
        return 'btn-success';
      default:
        return '';
    }
  }

  getRowStyle() {
    switch (this.status) {
      case DiffStatus.new:
        return 'text-primary';
      case DiffStatus.updated:
        return 'text-success';
      default:
        return '';
    }
  }

  async save() {
    if (this.existingActivities.length > 0) {
      const activitiesToRemove = this.processOverlappingActivities();
      await this.importService.remove(activitiesToRemove);

      for (let activity of this.existingActivities) {
        await this.importService.save(activity);
      }
    }

    await this.importService.save(this.importedActivity);
    this.status = DiffStatus.same;
    this.completed.emit(this.importedActivity);
  }

  async cancel() {
    this.completed.emit(this.importedActivity);
  }

  processOverlappingActivities(): Activity[] {
    const activitiesToRemove: Activity[] = [];

    for (let i = 0; i < this.existingActivities.length; i++) {
      const existingActivity = this.existingActivities[i];

      // Check for no overlap between existingActivity and importedActivity
      if (existingActivity.till <= this.importedActivity.from || existingActivity.from >= this.importedActivity.till) {
        continue;
      }

      if (existingActivity.from <= this.importedActivity.from) {
        // ----------A----------B----- Existing
        // ---------------A---------B- Imported
        existingActivity.till = this.importedActivity.from;
        // ----------A----B----------- Existing
        // ---------------A---------B- Imported
      } else if (existingActivity.from > this.importedActivity.from) {
        // ---------------A---------B- Existing
        // ----------A----------B----- Imported
        existingActivity.from = this.importedActivity.till;
        // ---------------------A---B- Existing
        // ----------A----------B----- Imported
      }

      if (existingActivity.from >= existingActivity.till) {
        activitiesToRemove.push(existingActivity);
        this.existingActivities.splice(i, 1);
        i--;
      }
    }

    return activitiesToRemove;
  }

  protected readonly DiffStatus = DiffStatus;
}

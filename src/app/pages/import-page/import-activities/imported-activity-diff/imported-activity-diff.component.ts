import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';

import { Activity } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { ActivitiesRepositoryService } from '../../../../repository/activities-repository.service';
import { ImportActivitiesService } from '../import-activities.service';
import { DaysRepositoryService } from '../../../../repository/days-repository.service';
import { ActivitiesService } from '../../../../services/activities.service';

@Component({
  selector: 'app-imported-activity-diff',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgClass,
    NgForOf,
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
    private activitiesService: ActivitiesService
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

    if (existingActivity.equals(this.importedActivity)) {
      return DiffStatus.same;
    } else {
      return DiffStatus.updated;
    }
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
    await this.importService.save(this.importedActivity);
    this.status = DiffStatus.same;
    this.completed.emit(this.importedActivity);
  }

  async cancel() {
    this.completed.emit(this.importedActivity);
  }

  protected readonly DiffStatus = DiffStatus;
}

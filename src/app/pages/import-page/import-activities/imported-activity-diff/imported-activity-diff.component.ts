import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass, NgIf } from '@angular/common';

import { Activity } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { ActivitiesRepositoryService } from '../../../../repository/activities-repository.service';
import { ImportActivitiesService } from '../import-activities.service';

@Component({
  selector: 'app-imported-activity-diff',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgClass,
  ],
  templateUrl: './imported-activity-diff.component.html',
  styleUrl: './imported-activity-diff.component.scss'
})
export class ImportedActivityDiffComponent implements OnInit {
  status: DiffStatus = DiffStatus.same;
  existingActivity: Activity|null = null;

  @Input()
  importedActivity!: Activity;

  @Output()
  completed = new EventEmitter<Activity>();

  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private service: ImportActivitiesService
  ) {}

  async ngOnInit() {
    if (!this.importedActivity) {
      return;
    }

    this.existingActivity = await this.activityRepository.getById(this.importedActivity.id);
    this.status = this.getDiffStatus();

    if (this.status === DiffStatus.same) {
      this.completed.emit(this.importedActivity);
    }
  }

  getDiffStatus(): DiffStatus {
    if (!this.existingActivity) {
      return DiffStatus.new;
    }

    if (!this.existingActivity.equals(this.importedActivity)) {
      return DiffStatus.updated;
    }

    return DiffStatus.same;
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
    await this.service.save(this.importedActivity);
    this.status = DiffStatus.same;
    this.completed.emit(this.importedActivity);
  }

  async cancel() {
    this.completed.emit(this.importedActivity);
  }

  protected readonly DiffStatus = DiffStatus;
}

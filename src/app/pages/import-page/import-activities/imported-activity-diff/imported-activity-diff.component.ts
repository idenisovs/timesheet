import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Activity, Day } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { ActivitiesRepositoryService } from '../../../../repository/activities-repository.service';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { SaveActivitiesWorkflowService } from '../../../../workflows/save-activities-workflow.service';
import { DaysRepositoryService } from '../../../../repository/days-repository.service';

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
  status = DiffStatus.same;
  existingActivity: Activity|null = null;

  @Input()
  importedActivity!: Activity;

  @Output()
  completed = new EventEmitter<Activity>();

  constructor(
    private activityRepository: ActivitiesRepositoryService,
    private dayRepository: DaysRepositoryService,
    private activitySaveWorkflow: SaveActivitiesWorkflowService
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
    return DiffStatus.same;
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
    const day = await this.getActivityDay();

    await this.activitySaveWorkflow.save(day, [this.importedActivity], [])

    this.status = DiffStatus.same;
    this.completed.emit(this.importedActivity);
  }

  async cancel() {
    this.completed.emit(this.importedActivity);
  }

  async getActivityDay(): Promise<Day> {
    let day = await this.dayRepository.getById(this.importedActivity.dayId);

    if (day) {
      return day;
    }

    day = new Day();
    day.id = this.importedActivity.dayId;
    return day;
  }

  protected readonly DiffStatus = DiffStatus;
}

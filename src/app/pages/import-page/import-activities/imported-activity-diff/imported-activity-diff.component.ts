import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Activity, Day, Week } from '../../../../dto';
import { DiffStatus } from '../../DiffStatus';
import { ActivitiesRepositoryService } from '../../../../repository/activities-repository.service';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { SaveActivitiesWorkflowService } from '../../../../workflows/save-activities-workflow.service';
import { DaysRepositoryService } from '../../../../repository/days-repository.service';
import { WeeksRepositoryService } from '../../../../repository/weeks-repository.service';

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
    private activitySaveWorkflow: SaveActivitiesWorkflowService,
    private weekRepository: WeeksRepositoryService
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

    await this.createWeekIfNotExists();

    day = new Day();

    day.id = this.importedActivity.dayId;
    day.weekId = this.importedActivity.weekId;
    day.date = new Date(this.importedActivity.date);

    return day;
  }

  async createWeekIfNotExists(): Promise<void> {
    const existingWeek = await this.weekRepository.getById(this.importedActivity.weekId);

    if (existingWeek) {
      return;
    }

    const week = new Week(this.importedActivity.date);
    week.id = this.importedActivity.weekId;
    await this.weekRepository.save(week);
  }

  protected readonly DiffStatus = DiffStatus;
}

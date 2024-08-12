import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { DatePipe, JsonPipe, NgForOf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Activity, Day } from '../../dto';
import { DailyActivityItemComponent } from '../daily-activity-item/daily-activity-item.component';
import { DailyActivitiesWeekDayService } from './daily-activities-week-day.service';
import { DailyActivitiesForm, ActivityFormGroup } from './DailyActivitiesForm';
import { SaveActivitiesWorkflowService } from '../../workflows/save-activities-workflow.service';
import { DailySummaryComponent } from './daily-summary/daily-summary.component';
import { ActivitiesService } from '../../services/activities.service';
import { ActivitiesRepositoryService } from '../../repository/activities-repository.service';

@Component({
  selector: 'app-daily-activities-week-day',
  standalone: true,
  imports: [
    JsonPipe,
    DatePipe,
    ReactiveFormsModule,
    NgForOf,
    DailyActivityItemComponent,
  ],
  templateUrl: './daily-activities-week-day.component.html',
  styleUrl: './daily-activities-week-day.component.scss'
})
export class DailyActivitiesWeekDayComponent implements OnInit, OnDestroy {
  totalDuration = '0h';
  isChanged = false;
  form: FormGroup<DailyActivitiesForm> = this.fb.group({
    activities: this.fb.array([
      this.service.makeActivityFormItem()
    ])
  });

  valueChangesHandler?: Subscription;
  removableActivityIds: string[] = [];
  activities: Activity[] = [];

  get ActivityFormArray(): FormArray<ActivityFormGroup> {
    return this.form.get('activities') as FormArray<ActivityFormGroup>;
  }

  get ActivityFormArrayItems(): ActivityFormGroup[] {
    return this.ActivityFormArray.controls;
  }

  @Input()
  day!: Day;

  @Output()
  changes = new EventEmitter<void>();


  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private service: DailyActivitiesWeekDayService,
    private activitiesService: ActivitiesService,
    private saveActivitiesWorkflow: SaveActivitiesWorkflowService,
    private activityRepository: ActivitiesRepositoryService
  ) {}

  async ngOnInit() {
    this.activities = await this.activityRepository.getByDay(this.day);

    const activityFormItems = this.activities.map((activity: Activity) => {
      return this.service.makeActivityFormItem(activity);
    });

    if (activityFormItems.length) {
      this.form.setControl('activities', this.fb.array(activityFormItems));
    }

    this.totalDuration = this.activitiesService.calculateDuration(this.activities);

    this.valueChangesHandler = this.form.valueChanges.subscribe(() => {
      this.isChanged = true;
    });
  }

  ngOnDestroy() {
    if (this.valueChangesHandler) {
      this.valueChangesHandler.unsubscribe();
    }
  }

  add() {
    this.ActivityFormArray.push(this.service.makeActivityFormItem());
  }

  remove(activityId: string) {
    this.removableActivityIds.push(activityId);

    const idx = this.ActivityFormArray.value.findIndex((item: any) => item.id === activityId);

    this.ActivityFormArray.removeAt(idx);

    if (!this.ActivityFormArray.length) {
      this.add();
    }
  }

  async save() {
    this.activities = this.service.processActivityFormArray(this.ActivityFormArray, this.day, this.activities);

    await this.saveActivitiesWorkflow.save(this.day, this.activities, this.removableActivityIds);

    this.totalDuration = this.activitiesService.calculateDuration(this.activities);
    this.isChanged = false;
    this.removableActivityIds = [];
    this.changes.emit();
  }

  showDailySummary() {
    const dailySummaryModalRef =  this.modal.open(DailySummaryComponent, {
      centered: true,
      size: 'lg'
    });

    const dailySummaryModal = (dailySummaryModalRef.componentInstance as DailySummaryComponent)

    dailySummaryModal.day = this.day;
  }
}

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { DatePipe, NgForOf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Activity, Day } from '../../dto';
import { DailyActivityItemComponent } from '../daily-activity-item/daily-activity-item.component';
import { DailyActivitiesWeekDayService } from './daily-activities-week-day.service';
import { DailyActivitiesForm, ActivityFormGroup } from './DailyActivitiesForm';
import { SaveActivitiesWorkflowService } from '../../workflows/save-activities-workflow.service';
import { ActivitiesService } from '../../services/activities.service';
import { DailyOverviewModalComponent } from './daily-overview-modal/daily-overview-modal.component';
import { RemoveActivitiesWorkflowService } from '../../workflows/remove-activities-workflow.service';

@Component({
    selector: 'app-daily-activities-week-day',
    imports: [
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

  valueChangesHandler = this.form.valueChanges.subscribe(() => {
    this.isChanged = true;
  });

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
    private removeActivitiesWorkflow: RemoveActivitiesWorkflowService
  ) {}

  async ngOnInit() {
    await this.loadActivities();
  }

  ngOnDestroy() {
    this.valueChangesHandler.unsubscribe();
  }

  async loadActivities() {
    this.activities = await this.activitiesService.loadDailyActivities(this.day);
    this.updateActivitiesForm();
    this.totalDuration = this.activitiesService.calculateDuration(this.activities);
  }

  updateActivitiesForm() {
    if (this.activities.length) {
      const activityFormItems = this.activities.map((activity: Activity) => {
        return this.service.makeActivityFormItem(activity);
      });

      this.form.setControl('activities', this.fb.array(activityFormItems));
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
    await this.removeActivitiesWorkflow.run(this.removableActivityIds);
    await this.saveActivitiesWorkflow.run(this.activities);

    this.totalDuration = this.activitiesService.calculateDuration(this.activities);
    this.isChanged = false;
    this.removableActivityIds = [];
    this.changes.emit();
  }

  async reset() {
    await this.loadActivities();
    this.isChanged = false;
  }

  showDailyOverview() {
    const dailyOverviewModal =  this.modal.open(DailyOverviewModalComponent, {
      centered: true,
      size: 'lg'
    });

    const dailySummaryModal = (dailyOverviewModal.componentInstance as DailyOverviewModalComponent)

    dailySummaryModal.day = this.day;
  }
}

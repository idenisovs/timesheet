import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Activity, Day } from '../../dto';
import { DailyActivityItemComponent } from '../daily-activity-item/daily-activity-item.component';
import { DailyActivitiesWeekDayService } from './daily-activities-week-day.service';
import { DailyActivitiesForm, ActivityFormGroup } from './DailyActivitiesForm';
import { SaveActivitiesWorkflowService } from '../../workflows/save-activities-workflow.service';
import { ActivitiesService } from '../../services/activities.service';
import { RemoveActivitiesWorkflowService } from '../../workflows/remove-activities-workflow.service';
import { ScreenService } from '../../services/screen.service';
import {
  DailyActivitiesWeekDayHeaderComponent,
} from './daily-activities-week-day-header/daily-activities-week-day-header.component';
import {
  DailyActivitiesWeekDayFooterComponent,
} from './daily-activities-week-day-footer/daily-activities-week-day-footer.component';
import { DailyActivityItemMobileComponent } from '../daily-activity-item-mobile/daily-activity-item-mobile.component';
import {
	DailyActivitiesWeekDayStickyBottomComponent
} from './daily-activities-week-day-sticky-bottom/daily-activities-week-day-sticky-bottom.component';

@Component({
  selector: 'app-daily-activities-week-day',
	imports: [
		ReactiveFormsModule,
		DailyActivityItemComponent,
		DailyActivitiesWeekDayHeaderComponent,
		DailyActivitiesWeekDayFooterComponent,
		DailyActivityItemMobileComponent,
		DailyActivitiesWeekDayStickyBottomComponent,
	],
  templateUrl: './daily-activities-week-day.component.html',
  styleUrl: './daily-activities-week-day.component.scss',
})
export class DailyActivitiesWeekDayComponent implements OnInit, OnDestroy {
  valueChangesSub!: Subscription;
  isMobileSub!: Subscription;

  removableActivityIds: string[] = [];
  activities: Activity[] = [];
  isMobile: boolean = false;
  totalDuration = '0h';
  isChanged = false;
  activatedActivityId: string | null = null;

  form: FormGroup<DailyActivitiesForm> = this.fb.group({
    activities: this.fb.array<ActivityFormGroup>([]),
  });

  @Input()
  day!: Day;

  @Output()
  changes = new EventEmitter<void>();

  get ActivityFormArray(): FormArray<ActivityFormGroup> {
    return this.form.get('activities') as FormArray<ActivityFormGroup>;
  }

  get ActivityFormArrayItems(): ActivityFormGroup[] {
    return this.ActivityFormArray.controls;
  }

  get TotalDuration() {
    return this.activitiesService.calculateDuration(this.activities);
  }

  constructor(
    private fb: FormBuilder,
    private service: DailyActivitiesWeekDayService,
    private activitiesService: ActivitiesService,
    private saveActivitiesWorkflow: SaveActivitiesWorkflowService,
    private removeActivitiesWorkflow: RemoveActivitiesWorkflowService,
    private screenService: ScreenService,
  ) {}

  async ngOnInit() {
    this.isMobileSub = this.screenService.isMobile$.subscribe((value: boolean) => {
      this.isMobile = value;
    });

    await this.loadActivities();

    this.activatedActivityId = this.activities[0].id

    this.valueChangesSub = this.form.valueChanges.subscribe(() => {
      this.isChanged = true;
      console.log('this.isChanged', this.isChanged);
    });
  }

  ngOnDestroy() {
    this.valueChangesSub.unsubscribe();
    this.isMobileSub.unsubscribe();
  }

  async loadActivities() {
    this.activities = await this.activitiesService.loadDailyActivities(this.day);

    if (!this.activities.length) {
      this.activities.push(new Activity());
    }

    this.updateActivitiesForm();
    this.totalDuration = this.activitiesService.calculateDuration(this.activities);
  }

  updateActivitiesForm() {
    const activityFormItems: ActivityFormGroup[] = this.activities.map((activity: Activity) => {
      return this.service.makeActivityFormItem(activity);
    });

    this.form.setControl('activities', this.fb.array(activityFormItems));
  }

  add() {
    const activityFormItem = this.service.makeActivityFormItem();

    if (this.isMobile) {
      this.ActivityFormArray.insert(0, activityFormItem)
    } else {
      this.ActivityFormArray.push(activityFormItem);
    }
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

    this.isChanged = false;
    this.removableActivityIds = [];
    this.changes.emit();
  }

  async reset() {
    await this.loadActivities();
    this.isChanged = false;
  }
}

import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
	private fb = inject(FormBuilder);
	private service = inject(DailyActivitiesWeekDayService);
	private activitiesService = inject(ActivitiesService);
	private saveActivitiesWorkflow = inject(SaveActivitiesWorkflowService);
	private removeActivitiesWorkflow = inject(RemoveActivitiesWorkflowService);
	private screenService = inject(ScreenService);

	valueChangesSub!: Subscription;
	isMobileSub!: Subscription;

	removableActivityIds: string[] = [];
	activities: Activity[] = [];
	isMobile: boolean = false;
	totalDuration = '0h';
	numberOfChanges = 0;

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

	async ngOnInit() {
		this.isMobileSub = this.screenService.isMobile$.subscribe((value: boolean) => {
			this.isMobile = value;
		});

		await this.loadActivities();

		this.valueChangesSub = this.form.valueChanges.subscribe(() => {
			this.numberOfChanges++;
		});
	}

	ngOnDestroy() {
		this.valueChangesSub.unsubscribe();
		this.isMobileSub.unsubscribe();
	}

	async loadActivities() {
		this.activities = await this.activitiesService.loadDailyActivities(this.day);

		if (!this.activities.length) {
			const activity = this.service.createActivity(null, this.day);
			this.activities.push(activity);
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
		const activity = this.service.createActivity(null, this.day);
		const activityFormItem = this.service.makeActivityFormItem(activity);

		const next = [...this.ActivityFormArrayItems];

		if (this.isMobile) {
			next.splice(0, 0, activityFormItem);
		} else {
			next.push(activityFormItem);
		}

		this.form.setControl('activities', this.fb.array(next));
	}

	proceed(activityId: string) {
		const [existingActivity, existingActivityIdx] = this.service.findById(this.activities, activityId);
		const activity: Activity = this.service.continueActivity(existingActivity);
		const activityFormItem: ActivityFormGroup = this.service.makeActivityFormItem(activity);

		const next = [...this.ActivityFormArrayItems];
		next.splice(existingActivityIdx, 0, activityFormItem);
		this.form.setControl('activities', this.fb.array(next));
	}

	remove(activityId: string) {
		const activityIdx = this.ActivityFormArrayItems.findIndex((activityFormItem: ActivityFormGroup) => {
			return activityFormItem.get('id')?.value === activityId;
		});

		const next = [...this.ActivityFormArrayItems];
		next.splice(activityIdx, 1);
		this.form.setControl('activities', this.fb.array(next));

		this.removableActivityIds.push(activityId);
	}

	async save() {
		this.activities = this.service.processActivityFormArray(this.ActivityFormArray, this.day, this.activities);
		await this.removeActivitiesWorkflow.run(this.removableActivityIds);
		await this.saveActivitiesWorkflow.run(this.activities);

		this.numberOfChanges = 0;
		this.removableActivityIds = [];
		this.changes.emit();
	}

	async reset() {
		await this.loadActivities();
		this.numberOfChanges = 0;
	}
}

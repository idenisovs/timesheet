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
			this.add();
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

		if (this.isMobile) {
			this.activities.splice(0, 0, activity);
		} else {
			this.activities.push(activity);
		}

		this.updateActivitiesForm();
	}

	proceed(activityId: string) {
		const existingActivity = this.activities.find((activity: Activity) => activity.id === activityId) as Activity;
		const existingActivityIdx = this.activities.indexOf(existingActivity);
		const activity = this.service.continueActivity(existingActivity);
		this.activities.splice(existingActivityIdx, 0, activity);
		this.updateActivitiesForm();
	}

	remove(activityId: string) {
		const removableActivity = this.activities.find((activity: Activity) => activity.id === activityId) as Activity;
		const removableActivityIdx = this.activities.indexOf(removableActivity);
		this.activities.splice(removableActivityIdx, 1);
		this.removableActivityIds.push(activityId);

		if (this.activities.length === 0) {
			this.add();
		} else {
			this.updateActivitiesForm();
		}
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

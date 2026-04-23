import {
	Component,
	inject,
	input,
	InputSignal,
	OnDestroy,
	OnInit,
	output,
	signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DailyActivitiesWeekDayService } from '../daily-activities-week-day.service';
import { ActivitiesService } from '../../../services/activities.service';
import { SaveActivitiesWorkflowService } from '../../../workflows/save-activities-workflow.service';
import { RemoveActivitiesWorkflowService } from '../../../workflows/remove-activities-workflow.service';
import { Activity, Day } from '../../../entities';
import { ActivityFormGroup, DailyActivitiesForm } from '../DailyActivitiesForm';
import {
	DailyActivitiesWeekDayFooterComponent,
} from '../daily-activities-week-day-footer/daily-activities-week-day-footer.component';
import {
	DailyActivitiesWeekDayHeaderComponent,
} from '../daily-activities-week-day-header/daily-activities-week-day-header.component';
import { DailyActivityItemComponent } from '../../daily-activity-item/daily-activity-item.component';
import {
	DailyActivitiesWeekDayMissingComponent,
} from '../../daily-activities-week-day-missing/daily-activities-week-day-missing.component';
import { getCurrentDate } from '../../../utils/date-v2';

@Component({
	selector: 'app-daily-activities-week-day-desktop',
	imports: [
		DailyActivitiesWeekDayFooterComponent,
		DailyActivitiesWeekDayHeaderComponent,
		DailyActivityItemComponent,
		FormsModule,
		ReactiveFormsModule,
		DailyActivitiesWeekDayMissingComponent,
	],
	templateUrl: './daily-activities-week-day-desktop.component.html',
	styleUrl: './daily-activities-week-day-desktop.component.scss',
})
export class DailyActivitiesWeekDayDesktopComponent implements OnInit, OnDestroy {
	protected fb = inject(FormBuilder);
	protected service = inject(DailyActivitiesWeekDayService);
	private activitiesService = inject(ActivitiesService);
	private saveActivitiesWorkflow = inject(SaveActivitiesWorkflowService);
	private removeActivitiesWorkflow = inject(RemoveActivitiesWorkflowService);

	valueChangesSub!: Subscription;
	removableActivityIds: string[] = [];
	activities: Activity[] = [];
	totalDuration = '0h';
	numberOfChanges = signal(0);

	form: FormGroup<DailyActivitiesForm> = this.fb.group({
		activities: this.fb.array<ActivityFormGroup>([]),
	});

	day: InputSignal<Day> = input.required<Day>();
	isMissingDaysVisible: InputSignal<boolean> = input(false);

	changes = output();

	get ActivityFormArray(): FormArray<ActivityFormGroup> {
		return this.form.get('activities') as FormArray<ActivityFormGroup>;
	}

	get ActivityFormArrayItems(): ActivityFormGroup[] {
		return this.ActivityFormArray.controls;
	}

	get ActivityFormArrayLength(): number {
		return this.ActivityFormArray.value.length;
	}

	async ngOnInit() {
		await this.loadActivities();

		this.valueChangesSub = this.form.valueChanges.subscribe(() => {
			this.numberOfChanges.update(n => n + 1);
		});
	}

	ngOnDestroy() {
		this.valueChangesSub.unsubscribe();
	}

	async loadActivities() {
		this.activities = await this.activitiesService.loadDailyActivities(this.day());

		if (this.activities.length === 0 && this.day().date === getCurrentDate()) {
			const activity = new Activity().at(this.day());
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
		const activityFormItem = this.createActivityFormItem();
		const next = [...this.ActivityFormArrayItems];
		next.push(activityFormItem);
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

		if (!this.ActivityFormArrayLength && this.day().date === getCurrentDate()) {
			this.add();
		}
	}

	async save() {
		this.activities = this.service.processActivityFormArray(this.ActivityFormArray, this.day(), this.activities);
		await this.removeActivitiesWorkflow.run(this.removableActivityIds);
		await this.saveActivitiesWorkflow.run(this.activities);

		this.numberOfChanges.set(0);
		this.removableActivityIds = [];
		this.changes.emit();
	}

	async reset() {
		await this.loadActivities();
		this.numberOfChanges.set(0);
	}

	protected async appendMissingDay(day: Day) {
		await this.activitiesService.createDailyActivity(day);
		await this.reset();
	}

	protected createActivityFormItem(): ActivityFormGroup {
		const activity = new Activity().at(this.day());
		return this.service.makeActivityFormItem(activity);
	}
}

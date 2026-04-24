import {
	Component,
	effect,
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
import { Activity, Day } from '../../../entities';
import { ActivityFormGroup, DailyActivitiesForm } from '../DailyActivitiesForm';
import {
	DailyActivitiesWeekDayFooterComponent,
} from '../daily-activities-week-day-footer/daily-activities-week-day-footer.component';
import {
	DailyActivitiesWeekDayHeaderComponent,
} from '../daily-activities-week-day-header/daily-activities-week-day-header.component';
import { DailyActivityItemComponent } from '../../daily-activity-item/daily-activity-item.component';
import { getCurrentDate } from '../../../utils/date-v2';

@Component({
	selector: 'app-daily-activities-week-day-desktop',
	imports: [
		DailyActivitiesWeekDayFooterComponent,
		DailyActivitiesWeekDayHeaderComponent,
		DailyActivityItemComponent,
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: './daily-activities-week-day-desktop.component.html',
	styleUrl: './daily-activities-week-day-desktop.component.scss',
})
export class DailyActivitiesWeekDayDesktopComponent implements OnInit, OnDestroy {
	protected readonly service = inject(DailyActivitiesWeekDayService);
	protected readonly activitiesService = inject(ActivitiesService);
	private readonly fb = inject(FormBuilder);

	public day: InputSignal<Day> = input.required<Day>();
	public activities: InputSignal<Activity[]> = input.required<Activity[]>();

	public changes = output<Activity[]>();

	protected totalDuration = signal('0h');
	protected numberOfChanges = signal(0);
	protected form: FormGroup<DailyActivitiesForm> = this.fb.group({
		activities: this.fb.array<ActivityFormGroup>([]),
	});

	private valueChangesSub!: Subscription;

	protected get ActivityFormArray(): FormArray<ActivityFormGroup> {
		return this.form.get('activities') as FormArray<ActivityFormGroup>;
	}

	protected get ActivityFormArrayItems(): ActivityFormGroup[] {
		return this.ActivityFormArray.controls;
	}

	constructor() {
		effect(() => {
			this.updateActivitiesForm();
			const totalDuration = this.activitiesService.calculateDuration(this.activities());
			this.totalDuration.set(totalDuration);
			this.numberOfChanges.set(0);
		});
	}

	public async ngOnInit() {
		this.valueChangesSub = this.form.valueChanges.subscribe(() => {
			this.numberOfChanges.update(n => n + 1);
		});
	}

	public ngOnDestroy() {
		this.valueChangesSub.unsubscribe();
	}

	protected add() {
		const activityFormItem = this.createActivityFormItem();
		this.ActivityFormArray.push(activityFormItem);
	}

	protected remove(activityId: string) {
		const activityIdx = this.ActivityFormArrayItems.findIndex((activityFormItem: ActivityFormGroup) => {
			return activityFormItem.get('id')?.value === activityId;
		});

		this.ActivityFormArray.removeAt(activityIdx);

		if (!this.ActivityFormArray.length && this.day().date === getCurrentDate()) {
			this.add();
		}
	}

	protected async save() {
		const activities: Activity[] = this.service.processActivityFormArray(
			this.ActivityFormArray,
			this.day(),
			this.activities(),
		);
		this.changes.emit(activities);
	}

	protected async reset() {
		this.updateActivitiesForm();
		this.numberOfChanges.set(0);
	}

	protected createActivityFormItem(): ActivityFormGroup {
		const activity = new Activity().at(this.day());
		return this.service.makeFormItemFromActivity(activity);
	}

	protected sorted() {
		return this.activitiesService.sort(this.activities());
	}

	private updateActivitiesForm() {
		const activityFormItems: ActivityFormGroup[] = this.sorted().map((activity: Activity) => {
			return this.service.makeFormItemFromActivity(activity);
		});

		this.form.setControl('activities', this.fb.array(activityFormItems), { emitEvent: false });
	}
}

import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DayDesktopComponent } from '../day-desktop/day-desktop.component';
import { Activity } from '@entities';
import { ActivityFormGroup } from '../DailyActivitiesForm';
import { DailyActivityItemService } from '../daily-activity-item/daily-activity-item.service';
import { ActivityTimesComponent } from './activity-times/activity-times.component';
import { DayMobileHeaderComponent } from './day-mobile-header/day-mobile-header.component';
import { DayMobileActivityComponent } from './day-mobile-activity/day-mobile-activity.component';
import { ActivityEditModalComponent } from './activity-edit-modal/activity-edit-modal.component';

@Component({
	selector: 'app-day-mobile',
	imports: [
		DayMobileHeaderComponent,
		DayMobileActivityComponent,
		FormsModule,
		ReactiveFormsModule,
		ActivityTimesComponent,
	],
	templateUrl: './day-mobile.component.html',
	styleUrl: './day-mobile.component.scss',
	providers: [DailyActivityItemService],
})
export class DayMobileComponent extends DayDesktopComponent {
	private readonly modal = inject(NgbModal);

	protected openEditModal(activity: Activity) {
		const activityFormItem = this.ActivityFormArrayItems.find((item: ActivityFormGroup) => {
			return item.get('id')?.value === activity.id;
		});

		if (!activityFormItem) {
			return;
		}

		const sorted = this.activitiesService.sort(this.activities());
		const activityIdx = sorted.findIndex((item: Activity) => item.id === activity.id);
		const previousActivity = sorted[activityIdx - 1];
		const nextActivity = sorted[activityIdx + 1];

		const modalRef = this.modal.open(ActivityEditModalComponent, {
			fullscreen: true,
		});

		const editModal = modalRef.componentInstance as ActivityEditModalComponent;
		editModal.activity = activity;
		editModal.activityFormItem = activityFormItem;

		if (previousActivity) {
			editModal.previousActivity = previousActivity;
		}

		if (nextActivity) {
			editModal.nextActivity = nextActivity;
		}
	}

	protected add() {
		const activityFormItem = this.createActivityFormItem();
		this.ActivityFormArray.insert(0, activityFormItem);
	}

	protected proceed(activityId: string) {
		const [existingActivity] = this.service.findById(this.activities(), activityId);
		const activity: Activity = this.service.continueActivity(existingActivity);
		const activityFormItem: ActivityFormGroup = this.service.makeFormItemFromActivity(activity);
		this.ActivityFormArray.insert(0, activityFormItem);
	}

	protected sorted(): Activity[] {
		return this.activitiesService.sort(this.activities(), true);
	}
}

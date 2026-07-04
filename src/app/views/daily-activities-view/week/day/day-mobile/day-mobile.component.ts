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

	protected async openEditModal(activity: Activity) {
		// The parent DayDesktopComponent defines the FormGroup since it is displaying
		// the edit form for the whole day straightly.
		// In the mobile version the inputs is defined in separate ActivityEditModalComponent
		const activityFormItem = this.ActivityFormArrayItems.find((item: ActivityFormGroup) => {
			return item.get('id')?.value === activity.id;
		}) as ActivityFormGroup;

		const initialFormValue = activityFormItem.getRawValue();

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

		try {
			const result = await modalRef.result;
			console.log(result);
		} catch {
			activityFormItem.reset(initialFormValue);
		}
	}

	protected add() {
		const activityFormItem = this.createActivityFormItem();
		this.ActivityFormArray.insert(0, activityFormItem);
	}

	protected sorted(): Activity[] {
		return this.activitiesService.sort(this.activities(), true);
	}
}

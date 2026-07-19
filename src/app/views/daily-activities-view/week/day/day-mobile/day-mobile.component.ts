import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Activity } from '@entities';
import { DayDesktopComponent } from '../day-desktop/day-desktop.component';
import { ActivityFormGroup } from '../DailyActivitiesForm';
import {
	DailyActivityItemService
} from '../daily-activity-item/daily-activity-item.service';
import {
	ActivityTimesComponent
} from './activity-times/activity-times.component';
import {
	DayMobileHeaderComponent
} from './day-mobile-header/day-mobile-header.component';
import {
	DayMobileActivityComponent
} from './day-mobile-activity/day-mobile-activity.component';
import {
	ActivityEditModalComponent
} from './activity-edit-modal/activity-edit-modal.component';

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
	providers: [ DailyActivityItemService ],
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

		const result = await this.getActivityModalResult(modalRef);

		switch (result) {
			case 'save':
				await this.save();
				break;
			case 'remove':
				this.remove(activity.id);
				await this.save();
				break;
			case 'cancel':
				activityFormItem.reset(initialFormValue);
				break;
		}
	}

	protected async add() {
		const activityFormItem = this.createActivityFormItem();
		this.ActivityFormArray.insert(0, activityFormItem);
		await this.save();
	}

	protected sorted(): Activity[] {
		return this.activitiesService.sort(this.activities(), true);
	}

	private async getActivityModalResult(modalRef: NgbModalRef): Promise<'save' | 'remove' | 'cancel'> {
		try {
			return await modalRef.result as 'save' | 'cancel';
		} catch {
			return 'cancel';
		}
	}
}

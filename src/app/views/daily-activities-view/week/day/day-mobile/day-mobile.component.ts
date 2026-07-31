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

		const sorted = this.service.processActivityFormArray(this.ActivityFormArray, this.day(), this.activities());
		// const sorted = this.activitiesService.sort(this.activities());
		const activityIdx = sorted.findIndex((item: Activity) => item.id === activity.id);

		console.log('Activity IDX:', activityIdx);

		const previousActivity = sorted[activityIdx - 1];
		const nextActivity = sorted[activityIdx + 1];

		const modalRef = this.modal.open(ActivityEditModalComponent, {
			fullscreen: true,
		});

		const editModal = modalRef.componentInstance as ActivityEditModalComponent;
		editModal.activity = activity;
		editModal.activityFormItem = activityFormItem;
		editModal.activityFormItems = this.ActivityFormArrayItems;

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
			case 'add':
				await this.add(true);
				break;
			case 'cancel':
				activityFormItem.reset(initialFormValue);
				break;
		}
	}

	protected async add(continueEditing = false) {
		const activity = this.activitiesService.createActivity(this.day());
		const activityFormItem = this.service.makeFormItemFromActivity(activity);
		// With new idea for order of activities I push the new activity at the end of the list
		this.ActivityFormArray.push(activityFormItem);

		await this.save();

		// TODO: Fix the race condition. The save() call above only starts the round trip,
		// since DayComponent does not await the changes output. Once it completes, the
		// activities input changes and the effect of DayDesktopComponent rebuilds the whole
		// FormArray, so the modal opened here stays bound to a discarded FormGroup and the
		// changes made in it are lost on save.
		if (continueEditing) {
			void this.openEditModal(activity);
		}
	}

	protected sorted(): Activity[] {
		return this.activitiesService.sort(this.activities());
	}

	private async getActivityModalResult(modalRef: NgbModalRef): Promise<'save' | 'remove' | 'add' | 'cancel'> {
		try {
			return await modalRef.result as 'save' | 'remove' | 'add' | 'cancel';
		} catch {
			return 'cancel';
		}
	}
}

import { Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
	NgbDropdown,
	NgbDropdownMenu,
	NgbDropdownToggle,
	NgbModal,
	NgbModalOptions, NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

import { TimePickerComponent } from './time-picker/time-picker.component';
import { DailyActivityItemService } from '../daily-activity-item/daily-activity-item.service';
import { ActivityItemEditModalComponent } from './activity-item-edit-modal/activity-item-edit-modal.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ActivityItemTitleComponent } from './activity-item-title/activity-item-title.component';
import { DescriptionPipe } from '../../pipes/description.pipe';
import { ActivityFormGroup } from '../../views/daily-activities-view/week/day/DailyActivitiesForm';

@Component({
	selector: 'app-daily-activity-item-mobile',
	imports: [
		ReactiveFormsModule,
		TimePickerComponent,
		NgbDropdown,
		NgbDropdownToggle,
		NgbDropdownMenu,
		MenuItemComponent,
		ActivityItemTitleComponent,
		DescriptionPipe,
	],
	templateUrl: './daily-activity-item-mobile.component.html',
	styleUrl: './daily-activity-item-mobile.component.scss',
})
export class DailyActivityItemMobileComponent {
	private readonly service = inject(DailyActivityItemService);
	private readonly modalService = inject(NgbModal);

	activityForm = input.required<ActivityFormGroup>();
	isFirst = input(true);

	add = output<string>();
	proceed = output<string>();
	remove = output<string>();

	constructor() {
		effect((onCleanup) => {
			const form = this.activityForm();

			const fromSub = form.get('from')?.valueChanges.subscribe(() => {
				this.service.handleFromChanges(form);
			});

			const tillSub = form.get('till')?.valueChanges.subscribe(() => {
				this.service.handleTillChanges(form);
			});

			onCleanup(() => {
				fromSub?.unsubscribe();
				tillSub?.unsubscribe();
			});
		});
	}

	get ActivityId(): string {
		return this.activityForm().get('id')?.value as string;
	}

	get ActivityName(): string {
		return this.activityForm().get('name')?.value ?? '';
	}

	async openEditModal() {
		const options: NgbModalOptions = {
			centered: false,
		};

		try {
			const activityEditModal: NgbModalRef = this.modalService.open(ActivityItemEditModalComponent, options);
			const instance = activityEditModal.componentInstance as ActivityItemEditModalComponent;
			instance.name = this.ActivityName;
			const nameUpdate = await activityEditModal.result as string;
			this.activityForm().get('name')?.setValue(nameUpdate);
		} catch (e) {
			console.log(e);
		}
	}
}

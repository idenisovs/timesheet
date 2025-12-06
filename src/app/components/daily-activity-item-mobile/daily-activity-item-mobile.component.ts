import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

type ActivityValue = {
	id: string | null;
	name: string | null;
	from: string | null;
	till: string | null;
	duration: string | null;
};

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
	fb = inject(FormBuilder);
	service = inject(DailyActivityItemService);
	modalService = inject(NgbModal);

	@Input()
	activityForm = this.fb.group<ActivityValue>({
		id: '',
		name: '',
		from: '',
		till: '',
		duration: '',
	});

	@Output()
	add = new EventEmitter<string>();

	@Output()
	copy = new EventEmitter<string>();

	@Output()
	remove = new EventEmitter<string>();

	get ActivityId(): string {
		return this.activityForm.get('id')?.value as string;
	}

	get ActivityName(): string {
		return this.activityForm.get('name')?.value ?? '';
	}

	handleFromChanges() {
		this.service.handleFromChanges(this.activityForm);
	}

	handleTillChanges() {
		this.service.handleTillChanges(this.activityForm);
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
			this.activityForm.get('name')?.setValue(nameUpdate);
		} catch (e) {
			console.log(e);
		}
	}
}

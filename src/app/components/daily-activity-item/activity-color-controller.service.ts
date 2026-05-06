import { computed, inject, Injectable, signal, untracked } from '@angular/core';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../services/colors.service';

@Injectable()
export class ActivityColorControllerService {
	private readonly service = inject(DailyActivityItemService);
	private readonly colorsService = inject(ColorsService);

	private originalName = signal<string>('');
	public readonly originalPrefix = computed<string>(() => this.getPrefixFromName(this.originalName()));

	private currentName = signal<string>('');
	public readonly currentPrefix = computed<string>(() => this.getPrefixFromName(this.currentName()));
	public readonly hasPrefix = computed<boolean>(() => this.currentPrefix().length > 0);

	public readonly isPrefixChanged = computed<boolean>(() => this.originalPrefix() !== this.currentPrefix());
	public readonly isNameInitiallyEmpty = signal<boolean>(true);
	public readonly isActivityUnique = signal<boolean>(true);
	public readonly isColorChangeAllowed = signal<boolean>(true);

	private activityId = '';
	private currentColor = '';
	private colorUpdate: string | null = null;
	private activityFormItems: ActivityFormGroup[] = [];

	public setActivity(id: string, name: string): void {
		this.activityId = id;

		this.originalName.set(name);
		this.currentName.set(name);

		this.isColorChangeAllowed.set(true);
		this.isNameInitiallyEmpty.set(name.length === 0);

		this.checkIfActivityUnique().then(isUnique => {
			this.isActivityUnique.set(isUnique);
		});
	}

	public async getActivityColor(
		activityFormItems: ActivityFormGroup[],
		activityFormItem: ActivityFormGroup,
	): Promise<void> {
		this.activityFormItems = activityFormItems;
		this.currentName.set(activityFormItem.get('name')?.value ?? '');
		this.currentColor = activityFormItem.get('color')?.value ?? '';
		this.colorUpdate = null;

		console.log('hasPrefix:', this.hasPrefix(), 'isPrefixChanged:', this.isPrefixChanged());

		await this.resolveColorUpdate();

		this.originalName.set(this.currentName());

		if (this.colorUpdate) {
			activityFormItem.get('color')?.setValue(this.colorUpdate);
		}
	}

	private async resolveColorUpdate(): Promise<void> {
		if (this.hasPrefix() && !this.isPrefixChanged()) {
			console.log('Prefix is the same, skipping!');
			return;
		}

		this.lookForColorInForm();

		if (!this.colorUpdate) {
			await this.lookForColorInDB();
		}

		if (!this.colorUpdate) {
			this.requestColorChange();
		}
	}

	private lookForColorInForm() {
		console.log('findSiblingColorInForm', this.currentName());

		const siblingColor = this.service.findSiblingColorInForm(
			this.activityFormItems,
			this.currentName(),
			this.activityId,
		);

		console.log('siblingColor', siblingColor);

		if (!siblingColor) {
			return;
		}

		this.setNotUniqueState();

		if (siblingColor === this.currentColor) {
			return;
		}

		console.log('siblingBasedColorChange');
		this.colorUpdate = siblingColor;
	}

	private async lookForColorInDB(): Promise<void> {
		console.log('lookForColorInDB');

		const siblingColor = await this.service.getSiblingColor(
			this.activityId,
			this.currentName()
		);

		if (!siblingColor) {
			console.log('There is no sibling color in DB!');
			return;
		}

		console.log('Found activity sibling color!');
		this.setNotUniqueState();

		if (siblingColor === this.currentColor) {
			return;
		}

		this.colorUpdate = siblingColor;
	}

	private setNotUniqueState(): void {
		this.isColorChangeAllowed.set(true);
		this.isActivityUnique.set(false);
		this.isNameInitiallyEmpty.set(false);
	}

	private requestColorChange() {
		console.log('requestColorChange');

		if (this.isActivityUnique()) {
			console.log('isActivityUnique')
			return;
		}

		if (this.isNameInitiallyEmpty()) {
			console.log('isNameInitiallyEmpty')
			return;
		}

		if (!this.isColorChangeAllowed()) {
			console.log('isColorChangeAllowed')
			return;
		}

		console.log('changing color')

		this.isColorChangeAllowed.set(false);
		this.isActivityUnique.set(true);

		this.colorUpdate = this.colorsService.getNextColorHsl();
	}

	private getPrefixFromName(name: string) {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	private checkIfActivityUnique(): Promise<boolean> {
		return this.service.isActivityUnique(untracked(() => this.originalName()), this.activityId);
	}
}

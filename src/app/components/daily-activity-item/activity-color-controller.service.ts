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
		this.currentName.set(activityFormItem.get('name')?.value ?? '');
		this.currentColor = activityFormItem.get('color')?.value ?? '';

		console.log('hasPrefix:', this.hasPrefix(), 'isPrefixChanged:', this.isPrefixChanged());

		const colorUpdate = await this.getColorUpdate(activityFormItems);

		this.originalName.set(this.currentName());

		if (colorUpdate) {
			activityFormItem.get('color')?.setValue(colorUpdate);
		}
	}

	private async getColorUpdate(
		activityFormItems: ActivityFormGroup[],
	) {
		if (this.hasPrefix() && !this.isPrefixChanged()) {
			console.log('Prefix is the same, skipping!');
			return null;
		}

		const colorFromForm = this.lookForColorInForm(activityFormItems);

		if (colorFromForm) {
			return colorFromForm !== this.currentColor ? colorFromForm : null;
		}

		const colorFromDB = await this.lookForColorInDB();

		if (colorFromDB) {
			console.log('Found activity color in DB!');
			return colorFromDB !== this.currentColor ? colorFromDB : null;
		}

		return this.requestColorChange();
	}

	private lookForColorInForm(activityFormItems: ActivityFormGroup[]) {
		console.log('findSiblingColorInForm', this.currentName());

		const siblingColor = this.service.findSiblingColorInForm(
			activityFormItems,
			this.currentName(),
			this.activityId,
		);

		console.log('siblingColor', siblingColor);

		if (siblingColor) {
			console.log('siblingBasedColorChange');
			this.setNotUniqueState();
			return siblingColor;
		}

		return null;
	}

	private async lookForColorInDB(): Promise<string | null> {
		console.log('lookForColorInDB');

		if (this.hasPrefix() && !this.isPrefixChanged()) {
			console.log('Prefix is not changed!');
			return null;
		}

		const color = await this.service.getSiblingColor(
			this.activityId,
			this.currentName()
		);

		if (color) {
			console.log('Found activity sibling color!');
			this.setNotUniqueState();
			return color;
		}

		console.log('There is no sibling color in DB!');
		return null;
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
			return null;
		}

		if (this.isNameInitiallyEmpty()) {
			console.log('isNameInitiallyEmpty')
			return null;
		}

		if (!this.isColorChangeAllowed()) {
			console.log('isColorChangeAllowed')
			return null;
		}

		console.log('changing color')

		this.isColorChangeAllowed.set(false);
		this.isActivityUnique.set(true);

		return this.colorsService.getNextColorHsl();
	}

	private getPrefixFromName(name: string) {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	private checkIfActivityUnique(): Promise<boolean> {
		return this.service.isActivityUnique(untracked(() => this.originalName()), this.activityId);
	}
}

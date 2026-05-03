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
	): Promise<string | null> {
		this.currentName.set(activityFormItem.get('name')?.value ?? '');
		this.currentColor = activityFormItem.get('color')?.value ?? '';

		if (this.hasPrefix() && !this.isPrefixChanged()) {
			console.log('Prefix is the same, skipping!');
			return null;
		}

		if (this.isPrefixChanged()) {
			this.originalName.set(this.currentName());
		}

		const colorUpdateFromForm = this.lookForColorInForm(activityFormItems);

		if (colorUpdateFromForm) {
			console.log('There is color update from form!');

			if (colorUpdateFromForm === this.currentColor) {
				console.log('But form returned the same color as current, nothing to do.')
				return null;
			} else {
				console.log('Return color from form!');
				return colorUpdateFromForm;
			}
		}

		const colorUpdateFromDB = await this.lookForColorInDB();

		if (colorUpdateFromDB) {
			if (colorUpdateFromDB === this.currentColor) {
				return null;
			} else {
				return colorUpdateFromDB;
			}
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

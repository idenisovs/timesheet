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

		const siblingColor = this.findSiblingColorInForm(activityFormItems);

		if (siblingColor) {
			console.log('There is sibling color!');

			if (siblingColor === this.currentColor) {
				console.log('Sibling has same color as current activity, skipping!')
				return null;
			}

			return this.siblingBasedColorChange(siblingColor);
		}

		return this.nameBasedColorChange();
	}

	private findSiblingColorInForm(activityFormItems: ActivityFormGroup[]) {
		console.log('findSiblingColorInForm');

		const siblingColor = this.service.findColorInActivities(
			activityFormItems,
			this.currentName(),
			this.activityId,
		);

		return siblingColor ? siblingColor : null;
	}

	private siblingBasedColorChange(color: string): string {
		console.log('siblingBasedColorChange');
		this.setNotUniqueState();
		return color;
	}

	private getPrefixFromName(name: string) {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	private async nameBasedColorChange(): Promise<string | null> {
		console.log('nameBasedColorChange');

		if (this.hasPrefix() && !this.isPrefixChanged()) {
			return null;
		}

		const color = await this.findSiblingColorInDB();

		if (color) {
			console.log('Found activity sibling color!');
			this.setNotUniqueState();
			return color;
		}

		console.log('There is no sibling color, requesting color change!');

		return this.requestColorChange();
	}

	private setNotUniqueState(): void {
		this.isColorChangeAllowed.set(true);
		this.isActivityUnique.set(false);
		this.isNameInitiallyEmpty.set(false);
	}

	private findSiblingColorInDB(): Promise<string | null> {
		return this.service.getSiblingColor(this.activityId, this.currentName());
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

	private checkIfActivityUnique(): Promise<boolean> {
		return this.service.isActivityUnique(untracked(() => this.originalName()), this.activityId);
	}
}

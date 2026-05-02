import { inject, Injectable } from '@angular/core';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../services/colors.service';

@Injectable()
export class ActivityColorControllerService {
	private readonly service = inject(DailyActivityItemService);
	private readonly colorsService = inject(ColorsService);

	private originalId = '';
	private originalName = ''
	private originalPrefix = '';

	private currentName = '';
	private currentPrefix = '';
	private currentColor = '';

	private isOriginalColor = true;
	private isOriginalNameEmpty = true;
	private isColorChanged = false;
	private isPrefixChanged = false;

	public setActivity(id: string, name: string): void {
		this.originalId = id;
		this.originalName = name;
		this.originalPrefix = this.getPrefixFromName(name);

		this.isOriginalNameEmpty = name.length === 0;
		this.isOriginalColor = true;
		this.isColorChanged = false;

		this.isOriginalNameUnique().then(isUnique => this.isOriginalColor = isUnique);
	}

	public async getActivityColor(
		activityFormItems: ActivityFormGroup[],
		activityFormItem: ActivityFormGroup,
	): Promise<string | null> {
		this.currentName = activityFormItem.get('name')?.value ?? '';
		this.currentColor = activityFormItem.get('color')?.value ?? '';

		const siblingColor = this.findSiblingColorToSet(activityFormItems);

		if (siblingColor) {
			return this.siblingBasedColorChange(siblingColor);
		}

		this.currentPrefix = this.getPrefixFromName(this.currentName);
		this.isPrefixChanged = this.currentPrefix !== this.originalPrefix;
		this.originalPrefix = this.currentPrefix;

		if (this.currentPrefix.length > 0) {
			return await this.prefixBasedColorChange();
		}

		return await this.nameBasedColorChange();
	}

	private findSiblingColorToSet(activityFormItems: ActivityFormGroup[]) {
		const siblingColor = this.service.findColorInActivities(
			activityFormItems,
			this.currentName,
			this.originalId,
		);

		if (siblingColor && this.currentColor !== siblingColor) {
			return siblingColor;
		}

		return null;
	}

	private siblingBasedColorChange(color: string): string {
		this.originalName = this.currentName;
		this.isOriginalNameEmpty = false;
		this.isOriginalColor = false;
		this.isColorChanged = false;
		return color;
	}

	private async prefixBasedColorChange(): Promise<string | null> {
		if (!this.isPrefixChanged) {
			return null;
		}

		const color = await this.findActivityColor(this.currentName);

		if (color) {
			this.isColorChanged = false;
			this.isOriginalColor = false;
			this.originalName = this.currentName;
			return color;
		}

		return this.requestColorChange();
	}

	private getPrefixFromName(name: string) {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	private async nameBasedColorChange(): Promise<string | null> {
		const color = await this.findActivityColor(this.currentName);

		if (color) {
			this.originalName = this.currentName;
			this.isOriginalColor = false;
			this.isColorChanged = false;
			return color;
		}

		return this.requestColorChange();
	}

	private findActivityColor(name: string): Promise<string | null> {
		return this.service.findColorForName(name);
	}

	private requestColorChange() {
		if (this.isOriginalColor) {
			return null;
		}

		if (this.isOriginalNameEmpty) {
			return null;
		}

		if (this.isColorChanged) {
			return null;
		}

		const color = this.colorsService.getNextColorHsl();
		this.isColorChanged = true;
		return color;
	}

	private isOriginalNameUnique(): Promise<boolean> {
		return this.service.isActivityUnique(this.originalName);
	}
}

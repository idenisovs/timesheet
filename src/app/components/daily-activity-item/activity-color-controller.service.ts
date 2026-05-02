import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../services/colors.service';

@Injectable()
export class ActivityColorControllerService {
	private readonly service = inject(DailyActivityItemService);
	private readonly colorsService = inject(ColorsService);

	private originalName = signal<string>('');
	private originalPrefix = signal<string>('');
	private isOriginalNameEmpty = computed(() => this.originalName().length === 0);
	private isOriginalColor = signal(true);
	private isColorChanged = signal(false);

	public set ActivityName(value: string) {
		this.originalName.set(value);
		this.originalPrefix.set(this.getPrefixFromName(value));
		this.isOriginalColor.set(true);
		this.isColorChanged.set(false);
	}

	public async getActivityColor(
		activityFormItems: ActivityFormGroup[],
		activityId: string,
		activityName: string,
		activityColor: string
	): Promise<string | null> {
		console.log('Activity color requested for', activityName);

		const siblingColor = this.findSiblingColorToSet(activityFormItems, activityId, activityName, activityColor);

		if (siblingColor) {
			return this.siblingBasedColorChange(activityName, siblingColor);
		}

		const currentPrefix = this.getPrefixFromName(activityName);

		if (currentPrefix.length || this.originalPrefix().length) {
			return await this.prefixBasedColorChange(currentPrefix, activityName);
		}

		return await this.nameBasedColorChange(activityName);
	}

	private siblingBasedColorChange(name: string, color: string): string {
		console.log('Sibling based activity color change!');

		this.originalName.set(name);
		this.isOriginalColor.set(false);
		this.isColorChanged.set(false);
		return color;
	}

	private async prefixBasedColorChange(currentPrefix: string, name: string): Promise<string | null> {
		console.log('Prefix based activity color change!');

		if (currentPrefix === this.originalPrefix()) {
			return null;
		}

		this.originalPrefix.set(currentPrefix);
		this.isOriginalColor.set(false);

		const color = await this.findActivityColor(name);

		if (color) {
			this.isColorChanged.set(false);
			return color;
		}

		this.isOriginalColor.set(false);
		return this.requestColorChange();
	}

	private getPrefixFromName(name: string) {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	private findSiblingColorToSet(activityFormItems: ActivityFormGroup[], id: string, name: string, color: string) {
		const siblingColor = this.service.findColorInActivities(
			activityFormItems,
			name,
			id
		);

		const isSiblingColorDifferent = siblingColor && color !== siblingColor;

		return isSiblingColorDifferent ? siblingColor : null;
	}

	private async nameBasedColorChange(name: string): Promise<string | null> {
		console.log('Name based activity color change!');

		const color = await this.findActivityColor(name);

		if (color) {
			this.originalName.set(name);
			this.isOriginalColor.set(false);
			this.isColorChanged.set(false);
			return color;
		}

		const isOriginalUnique = await this.isOriginalNameUnique();

		if (!isOriginalUnique) {
			this.isOriginalColor.set(false);
		}

		return this.requestColorChange();
	}

	private findActivityColor(name: string): Promise<string | null> {
		return this.service.findColorForName(name);
	}

	private requestColorChange() {
		console.log('Request color change!');

		if (this.isOriginalColor()) {
			return null;
		}

		if (this.isOriginalNameEmpty()) {
			return null;
		}

		if (this.isColorChanged()) {
			return null;
		}

		const color = this.colorsService.getNextColorHsl();
		this.isOriginalColor.set(true);
		this.isColorChanged.set(true);
		return color;
	}

	private isOriginalNameUnique(): Promise<boolean> {
		return this.service.isActivityUnique(this.originalName());
	}
}

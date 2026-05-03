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

		this.isActivityUnique.set(true);
		this.isColorChangeAllowed.set(true);
		this.isNameInitiallyEmpty.set(name.length === 0);

		this.isOriginalNameUnique().then(isUnique => {
			this.isActivityUnique.set(isUnique);
		});
	}

	public async getActivityColor(
		activityFormItems: ActivityFormGroup[],
		activityFormItem: ActivityFormGroup,
	): Promise<string | null> {
		this.currentName.set(activityFormItem.get('name')?.value ?? '');
		this.currentColor = activityFormItem.get('color')?.value ?? '';

		const siblingColor = this.findSiblingColorToSet(activityFormItems);

		if (siblingColor) {
			return this.siblingBasedColorChange(siblingColor);
		}

		if (this.currentPrefix().length > 0) {
			return this.prefixBasedColorChange();
		}

		return this.nameBasedColorChange();
	}

	private findSiblingColorToSet(activityFormItems: ActivityFormGroup[]) {
		const siblingColor = this.service.findColorInActivities(
			activityFormItems,
			this.currentName(),
			this.activityId,
		);

		if (siblingColor && this.currentColor !== siblingColor) {
			return siblingColor;
		}

		return null;
	}

	private siblingBasedColorChange(color: string): string {
		this.resetState();
		return color;
	}

	private async prefixBasedColorChange(): Promise<string | null> {
		if (!this.isPrefixChanged()) {
			return null;
		}

		const color = await this.findActivityColor(this.currentName());

		if (color) {
			this.resetState();
			return color;
		}

		return this.requestColorChange();
	}

	private getPrefixFromName(name: string) {
		const idx = name.indexOf(':');
		return idx === -1 ? '' : name.slice(0, idx);
	}

	private async nameBasedColorChange(): Promise<string | null> {
		if (this.currentName() === this.originalName()) {
			return null;
		}

		const color = await this.findActivityColor(this.currentName());

		if (color) {
			this.resetState();
			return color;
		}

		return this.requestColorChange();
	}

	private resetState(): void {
		this.isColorChangeAllowed.set(true);
		this.isActivityUnique.set(false);
		this.originalName.set(this.currentName());
		this.isNameInitiallyEmpty.set(false);
	}

	private findActivityColor(name: string): Promise<string | null> {
		return this.service.findColorForName(name);
	}

	private requestColorChange() {
		if (this.isActivityUnique()) {
			return null;
		}

		if (this.isNameInitiallyEmpty()) {
			return null;
		}

		if (!this.isColorChangeAllowed()) {
			return null;
		}

		const color = this.colorsService.getNextColorHsl();
		this.isColorChangeAllowed.set(false);
		return color;
	}

	private isOriginalNameUnique(): Promise<boolean> {
		return this.service.isActivityUnique(untracked(() => this.originalName()));
	}
}

import { computed, inject, Injectable, signal, untracked } from '@angular/core';

import { ActivityFormGroup } from '../daily-activities-week-day/DailyActivitiesForm';
import { DailyActivityItemService } from './daily-activity-item.service';
import { ColorsService } from '../../services/colors.service';

@Injectable()
export class ActivityColorControllerService {
	private readonly service = inject(DailyActivityItemService);
	private readonly colorsService = inject(ColorsService);

	private activityId = '';
	private originalName = signal<string>('');
	private originalPrefix = computed<string>(() => this.getPrefixFromName(this.originalName()));

	private currentName = signal<string>('');
	private currentPrefix = computed<string>(() => this.getPrefixFromName(this.currentName()));
	private currentColor = '';

	private isPrefixChanged = computed<boolean>(() => this.originalPrefix() !== this.currentPrefix());
	private isNameInitiallyEmpty = signal<boolean>(true);

	private isActivityUnique = signal<boolean>(true);
	private isColorChangeDenied = signal<boolean>(false);

	public readonly IsUnique = computed(() => this.isActivityUnique());
	public readonly IsChangeDenied = computed(() => this.isColorChangeDenied());
	public readonly HasPrefix = computed(() => this.currentPrefix().length > 0);
	public readonly IsOriginalNameEmpty = computed(() => this.isNameInitiallyEmpty());
	public readonly IsPrefixChanged = computed(() => this.isPrefixChanged());
	public readonly OriginalPrefix = computed(() => this.originalPrefix());
	public readonly CurrentPrefix = computed(() => this.currentPrefix());

	public setActivity(id: string, name: string): void {
		this.activityId = id;

		this.originalName.set(name);
		this.currentName.set(name);

		this.isActivityUnique.set(true);
		this.isColorChangeDenied.set(false);
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

		if (this.isPrefixChanged()) {
			this.originalName.set(this.currentName());
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
		console.log('sibling based color change')
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
		const color = await this.findActivityColor(this.currentName());

		if (color) {
			this.resetState();
			return color;
		}

		return this.requestColorChange();
	}

	private resetState(): void {
		this.isColorChangeDenied.set(false);
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

		if (this.isColorChangeDenied()) {
			return null;
		}

		const color = this.colorsService.getNextColorHsl();
		this.isColorChangeDenied.set(true);
		return color;
	}

	private isOriginalNameUnique(): Promise<boolean> {
		return this.service.isActivityUnique(untracked(() => this.originalName()));
	}
}

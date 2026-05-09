import { Component, effect, inject, input, signal } from '@angular/core';
import { disabled } from '@angular/forms/signals';

import { Activity } from '../../../entities';
import { ImportActivitiesService } from './import-activities.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { DiffStatus } from '../DiffStatus';
import { ImportProgressBarComponent } from '../import-progress-bar/import-progress-bar.component';

@Component({
	selector: 'app-import-activities',
	imports: [ImportProgressBarComponent],
	templateUrl: './import-activities.component.html',
	styleUrl: './import-activities.component.scss',
})
export class ImportActivitiesComponent {
	private importService = inject(ImportActivitiesService);
	private repo = inject(ActivitiesRepositoryService);

	importedActivities = input<Activity[]>([]);

	protected createdActivities = signal<Activity[]>([]);
	protected updatedActivities = signal<Activity[]>([]);
	protected sameActivityCount = signal(0);
	protected savedActivityCount = signal(0);
	protected activitiesToSaveCount = signal(0);

	get IsActivitiesToSaveAvailable() {
		return (this.createdActivities().length + this.updatedActivities().length) > 0;
	}

	constructor() {
		effect(() => {
			void this.processImportedActivities();
		});
	}

	async saveAll() {
		this.activitiesToSaveCount.set(this.createdActivities().length + this.updatedActivities().length);
		await this.saveNew();
		await this.saveUpdated();
	}

	async saveNew() {
		if (this.activitiesToSaveCount() === 0) {
			this.activitiesToSaveCount.set(this.createdActivities().length);
		}

		for (const activity of this.createdActivities()) {
			await this.importService.save(activity);
			this.savedActivityCount.update(prev => prev + 1);
		}

		this.createdActivities.set([]);
	}

	async saveUpdated() {
		if (this.activitiesToSaveCount() === 0) {
			this.activitiesToSaveCount.set(this.updatedActivities().length);
		}

		for (const activity of this.updatedActivities()) {
			await this.importService.save(activity);
			this.savedActivityCount.update(prev => prev + 1);
		}

		this.updatedActivities.set([]);
	}

	cancel() {
		this.createdActivities.set([]);
		this.updatedActivities.set([]);
	}

	private async processImportedActivities() {
		for (const importedActivity of this.importedActivities()) {
			const existingActivity = await this.repo.getById(importedActivity.id);
			const diffStatus = this.getDiffStatus(existingActivity, importedActivity);

			switch (diffStatus) {
				case DiffStatus.new:
					this.createdActivities.update(prev => [...prev, importedActivity]);
					break;
				case DiffStatus.updated:
					this.updatedActivities.update(prev => [...prev, importedActivity]);
					break;
				default:
					this.sameActivityCount.update(prev => prev + 1);
			}
		}
	}

	private getDiffStatus(existing: Activity | null, imported: Activity): DiffStatus {
		if (!existing) {
			return DiffStatus.new;
		}

		if (existing.equals(imported)) {
			return DiffStatus.same;
		}

		return DiffStatus.updated;
	}

	protected readonly disabled = disabled;
}

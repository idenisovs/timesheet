import { Component, effect, inject, input, signal } from '@angular/core';

import { Activity } from '../../../entities';
import { ImportActivitiesService } from './import-activities.service';
import { ActivitiesRepositoryService } from '../../../repository/activities-repository.service';
import { DiffStatus } from '../DiffStatus';

@Component({
	selector: 'app-import-activities',
	imports: [],
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

	get TotalLength() {
		return this.createdActivities().length + this.updatedActivities().length;
	}

	constructor() {
		effect(() => {
			void this.processImportedActivities();
		});
	}

	async saveAll() {
		await this.saveNew();
		await this.saveUpdated();
	}

	async saveNew() {
		for (const activity of this.createdActivities()) {
			await this.importService.save(activity);
		}

		this.createdActivities.set([]);
	}

	async saveUpdated() {
		for (const activity of this.updatedActivities()) {
			await this.importService.save(activity);
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
}
